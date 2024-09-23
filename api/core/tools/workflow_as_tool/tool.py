import json
import logging
from collections.abc import Generator
from typing import Any, Optional, Union

from core.file.file_obj import FileTransferMethod, FileVar
from core.tools.__base.tool import Tool
from core.tools.__base.tool_runtime import ToolRuntime
from core.tools.entities.tool_entities import ToolEntity, ToolInvokeMessage, ToolParameter, ToolProviderType
from extensions.ext_database import db
from models.account import Account
from models.model import App, EndUser
from models.workflow import Workflow

logger = logging.getLogger(__name__)


class WorkflowTool(Tool):
    workflow_app_id: str
    version: str
    workflow_entities: dict[str, Any]
    workflow_call_depth: int
    thread_pool_id: Optional[str] = None

    label: str

    """
    Workflow tool.
    """

    def __init__(
        self,
        workflow_app_id: str,
        version: str,
        workflow_entities: dict[str, Any],
        workflow_call_depth: int,
        entity: ToolEntity,
        runtime: ToolRuntime,
        label: str = "Workflow",
        thread_pool_id: Optional[str] = None,
    ):
        self.workflow_app_id = workflow_app_id
        self.version = version
        self.workflow_entities = workflow_entities
        self.workflow_call_depth = workflow_call_depth
        self.thread_pool_id = thread_pool_id
        self.label = label

        super().__init__(entity=entity, runtime=runtime)

    def tool_provider_type(self) -> ToolProviderType:
        """
        get the tool provider type

        :return: the tool provider type
        """
        return ToolProviderType.WORKFLOW

    def _invoke(self, user_id: str, tool_parameters: dict[str, Any]) -> Generator[ToolInvokeMessage, None, None]:
        """
        invoke the tool
        """
        app = self._get_app(app_id=self.workflow_app_id)
        workflow = self._get_workflow(app_id=self.workflow_app_id, version=self.version)

        # transform the tool parameters
        tool_parameters, files = self._transform_args(tool_parameters)

        from core.app.apps.workflow.app_generator import WorkflowAppGenerator

        generator = WorkflowAppGenerator()

        assert self.runtime
        assert self.runtime.invoke_from

        result = generator.generate(
            app_model=app,
            workflow=workflow,
            user=self._get_user(user_id),
            args={"inputs": tool_parameters, "files": files},
            invoke_from=self.runtime.invoke_from,
            stream=False,
            call_depth=self.workflow_call_depth + 1,
            workflow_thread_pool_id=self.thread_pool_id,
        )

        data = result.get("data", {})

        if data.get("error"):
            raise Exception(data.get("error"))

        if data.get("error"):
            raise Exception(data.get("error"))

        outputs = data.get("outputs", {})
        outputs, files = self._extract_files(outputs)
        for file in files:
            yield self.create_file_var_message(file)

        yield self.create_text_message(json.dumps(outputs, ensure_ascii=False))
        yield self.create_json_message(outputs)

    def _get_user(self, user_id: str) -> Union[EndUser, Account]:
        """
        get the user by user id
        """

        user = db.session.query(EndUser).filter(EndUser.id == user_id).first()
        if not user:
            user = db.session.query(Account).filter(Account.id == user_id).first()

        if not user:
            raise ValueError("user not found")

        return user

    def fork_tool_runtime(self, runtime: ToolRuntime) -> "WorkflowTool":
        """
        fork a new tool with meta data

        :param meta: the meta data of a tool call processing, tenant_id is required
        :return: the new tool
        """
        return self.__class__(
            entity=self.entity.model_copy(),
            runtime=runtime,
            workflow_app_id=self.workflow_app_id,
            workflow_entities=self.workflow_entities,
            workflow_call_depth=self.workflow_call_depth,
            version=self.version,
            label=self.label,
        )

    def _get_workflow(self, app_id: str, version: str) -> Workflow:
        """
        get the workflow by app id and version
        """
        if not version:
            workflow = (
                db.session.query(Workflow)
                .filter(Workflow.app_id == app_id, Workflow.version != "draft")
                .order_by(Workflow.created_at.desc())
                .first()
            )
        else:
            workflow = db.session.query(Workflow).filter(Workflow.app_id == app_id, Workflow.version == version).first()

        if not workflow:
            raise ValueError("workflow not found or not published")

        return workflow

    def _get_app(self, app_id: str) -> App:
        """
        get the app by app id
        """
        app = db.session.query(App).filter(App.id == app_id).first()
        if not app:
            raise ValueError("app not found")

        return app

    def _transform_args(self, tool_parameters: dict) -> tuple[dict, list[dict]]:
        """
        transform the tool parameters

        :param tool_parameters: the tool parameters
        :return: tool_parameters, files
        """
        parameter_rules = self.get_all_runtime_parameters()
        parameters_result = {}
        files = []
        for parameter in parameter_rules:
            if parameter.type == ToolParameter.ToolParameterType.FILE:
                file = tool_parameters.get(parameter.name)
                if file:
                    try:
                        file_var_list = [FileVar(**f) for f in file]
                        for file_var in file_var_list:
                            file_dict: dict[str, Any] = {
                                "transfer_method": file_var.transfer_method.value,
                                "type": file_var.type.value,
                            }
                            if file_var.transfer_method == FileTransferMethod.TOOL_FILE:
                                file_dict["tool_file_id"] = file_var.related_id
                            elif file_var.transfer_method == FileTransferMethod.LOCAL_FILE:
                                file_dict["upload_file_id"] = file_var.related_id
                            elif file_var.transfer_method == FileTransferMethod.REMOTE_URL:
                                file_dict["url"] = file_var.preview_url

                            files.append(file_dict)
                    except Exception as e:
                        logger.exception(e)
            else:
                parameters_result[parameter.name] = tool_parameters.get(parameter.name)

        return parameters_result, files

    def _extract_files(self, outputs: dict) -> tuple[dict, list[FileVar]]:
        """
        extract files from the result

        :param result: the result
        :return: the result, files
        """
        files = []
        result = {}
        for key, value in outputs.items():
            if isinstance(value, list):
                has_file = False
                for item in value:
                    if isinstance(item, dict) and item.get("__variant") == "FileVar":
                        try:
                            files.append(FileVar(**item))
                            has_file = True
                        except Exception as e:
                            pass
                if has_file:
                    continue

            result[key] = value

        return result, files