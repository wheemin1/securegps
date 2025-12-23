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
        className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 px-4 py-2 rounded-full text-sm font-medium h-auto transition-all"
        data-testid="button-advanced-toggle"
      >
        <span>{t('advanced.title')}</span>
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
                  Preserve color profile (ICC)
                </div>
                <div className="text-xs text-muted-foreground">
                  Recommended for photos requiring color precision
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
                  Export all as JPEG (may increase size for PNG/WebP)
                </div>
                <div className="text-xs text-muted-foreground">
                  Converts PNG/WebP to JPEG format
                </div>
              </div>
            </label>
            
            {/* Quality Slider */}
            <div className="space-y-2">
              <label htmlFor="qualitySlider" className="text-sm font-medium text-foreground">
                JPEG/WebP quality (default 85%): 
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
