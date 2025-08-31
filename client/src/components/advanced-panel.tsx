import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { useImageProcessor } from '@/hooks/use-image-processor';
import { useLanguage } from '@/hooks/use-language';
import { ChevronRight } from 'lucide-react';

export function AdvancedPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { options, updateOptions } = useImageProcessor();
  const { t } = useLanguage();

  return (
    <section className="mb-12">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-muted-foreground hover:text-foreground p-0 h-auto"
        data-testid="button-advanced-toggle"
      >
        <span className="text-sm font-medium">{t('advanced.title')}</span>
        <ChevronRight 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} 
        />
      </Button>
      
      {isOpen && (
        <div className="mt-4 p-6 bg-card border border-border rounded-lg space-y-4" data-testid="panel-advanced-options">
          <div className="space-y-4">
            {/* Keep ICC Profile Option */}
            <label className="flex items-start space-x-3 cursor-pointer">
              <Checkbox 
                checked={options.keepICC}
                onCheckedChange={(checked) => updateOptions({ keepICC: !!checked })}
                className="mt-1"
                data-testid="checkbox-keep-icc"
              />
              <div>
                <div className="text-sm font-medium text-foreground">
                  {t('advanced.keepICC.label')}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t('advanced.keepICC.description')}
                </div>
              </div>
            </label>
            
            {/* Force JPEG Option */}
            <label className="flex items-start space-x-3 cursor-pointer">
              <Checkbox 
                checked={options.forceJPEG}
                onCheckedChange={(checked) => updateOptions({ forceJPEG: !!checked })}
                className="mt-1"
                data-testid="checkbox-force-jpeg"
              />
              <div>
                <div className="text-sm font-medium text-foreground">
                  {t('advanced.forceJPEG.label')}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t('advanced.forceJPEG.description')}
                </div>
              </div>
            </label>
            
            {/* Quality Slider */}
            <div className="space-y-2">
              <label htmlFor="qualitySlider" className="text-sm font-medium text-foreground">
                {t('advanced.quality.label')} 
                <span className="font-bold" data-testid="text-quality-value">{options.quality}%</span>
              </label>
              <Slider
                value={[options.quality]}
                onValueChange={(value) => updateOptions({ quality: value[0] })}
                min={50}
                max={100}
                step={5}
                className="w-full"
                data-testid="slider-quality"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{t('advanced.quality.smaller')}</span>
                <span>{t('advanced.quality.better')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
