import { useReactFlow } from '@xyflow/react';
import { t } from 'i18next';
import { RefreshCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { useCallback } from 'react';
import { Button } from '../../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip';

import { CenterFlowIcon } from '../../icons';
import { VerticalDivider } from '../../ui/vertical-divider';

const CanvasControls = ({ topOffset }: { topOffset?: number }) => {
  const reactFlow = useReactFlow();

  const handleZoomIn = useCallback(() => {
    reactFlow.zoomIn({
      duration: 200,
    });
  }, [reactFlow]);

  const handleZoomOut = useCallback(() => {
    reactFlow.zoomOut({
      duration: 200,
    });
  }, [reactFlow]);

  const handleZoomReset = useCallback(() => {
    reactFlow.zoomTo(1);
  }, [reactFlow]);

  const handleFitToView = useCallback(async () => {
    await reactFlow.fitView({
      nodes: reactFlow.getNodes().slice(0, 5),
      minZoom: 0.5,
      maxZoom: 1.2,
      duration: 0,
    });

    if (topOffset) {
      const { x, zoom } = reactFlow.getViewport();
      reactFlow.setViewport({ x, y: topOffset, zoom }, { duration: 0 });
    }
  }, [reactFlow, topOffset]);

  return (
    <div className="bg-background absolute left-[10px] bottom-[10px] z-50 rounded-xl flex flex-row items-center gap-1 shadow-editor py-[2px] px-[8px]">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" onClick={handleZoomReset}>
            <RefreshCcw className="w-5 h-5 dark:text-primary" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">{t('Reset Zoom')}</TooltipContent>
      </Tooltip>

      <VerticalDivider height={24} />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="w-5 h-5 dark:text-primary" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">{t('Zoom Out')}</TooltipContent>
      </Tooltip>

      <VerticalDivider height={24} />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="w-5 h-5 dark:text-primary" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">{t('Zoom In')}</TooltipContent>
      </Tooltip>

      <VerticalDivider height={24} />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" onClick={handleFitToView}>
            <CenterFlowIcon className="w-5 h-5 dark:text-primary" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">{t('Fit to View')}</TooltipContent>
      </Tooltip>
    </div>
  );
};

export { CanvasControls };
