module pskl {
    export module tools {
        export class ToolIconBuilder {
            createIcon(tool, tooltipPosition?: string) {
                tooltipPosition = tooltipPosition || 'right';
                var tpl = pskl.utils.Template.get('drawingTool-item-template');
                return pskl.utils.Template.replace(tpl, {
                  cssclass : ['tool-icon', 'icon-' + tool.toolId].join(' '),
                  toolid : tool.toolId,
                  title : this.getTooltipText(tool),
                  tooltipposition : tooltipPosition
                });
              }

              getTooltipText(tool) {
                var descriptors = tool.tooltipDescriptors;
                return pskl.utils.TooltipFormatter.format(tool.getHelpText(), tool.shortcut, descriptors);
              }
        }
    }
}