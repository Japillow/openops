import { exceptionHandler } from '@openops/server-shared';
import {
  ApplicationError,
  ErrorCode,
  FlowId,
  FlowOperationRequest,
  FlowOperationType,
  FlowVersion,
  ProjectId,
} from '@openops/shared';
import { webhookSimulationService } from '../../webhooks/webhook-simulation/webhook-simulation-service';

type OnApplyOperationParams = {
  projectId: ProjectId;
  flowVersion: FlowVersion;
  operation: FlowOperationRequest;
};

type DeleteWebhookSimulationParams = {
  projectId: ProjectId;
  flowId: FlowId;
};

const deleteWebhookSimulation = async (
  params: DeleteWebhookSimulationParams,
): Promise<void> => {
  const { projectId, flowId } = params;

  try {
    await webhookSimulationService.delete({
      projectId,
      flowId,
    });
  } catch (e: unknown) {
    const notWebhookSimulationNotFoundError = !(
      e instanceof ApplicationError &&
      e.error.code === ErrorCode.ENTITY_NOT_FOUND
    );
    if (notWebhookSimulationNotFoundError) {
      throw e;
    }
  }
};

export const flowVersionSideEffects = {
  async preApplyOperation({
    projectId,
    flowVersion,
    operation,
  }: OnApplyOperationParams): Promise<void> {
    if (operation.type === FlowOperationType.UPDATE_TRIGGER) {
      try {
        await deleteWebhookSimulation({
          projectId,
          flowId: flowVersion.flowId,
        });
      } catch (e) {
        // Ignore error and continue the operation peacefully
        exceptionHandler.handle(e);
      }
    }
  },
};
