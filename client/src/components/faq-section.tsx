import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useLanguage } from '@/hooks/use-language';
import { ChevronDown } from 'lucide-react';

export function FAQSection() {
  const { t } = useLanguage();

  const faqs = [
    {
      question: t('faq.upload.question'),
      answer: t('faq.upload.answer'),
      testId: 'faq-upload'
    },
    {
      question: t('faq.metadata.question'),
      answer: t('faq.metadata.answer'),
      testId: 'faq-metadata'
    },
    {
      question: t('faq.formats.question'),
      answer: t('faq.formats.answer'),
      testId: 'faq-formats'
    },
    {
      question: t('faq.safety.question'),
      answer: t('faq.safety.answer'),
      testId: 'faq-safety'
    },
    {
      question: t('faq.detection.question'),
      answer: t('faq.detection.answer'),
      testId: 'faq-detection'
    },
    {
      question: t('faq.quality.question'),
      answer: t('faq.quality.answer'),
      testId: 'faq-quality'
    },
    {
      question: t('faq.limits.question'),
      answer: t('faq.limits.answer'),
      testId: 'faq-limits'
    },
    {
      question: t('faq.download.question'),
      answer: t('faq.download.answer'),
      testId: 'faq-download'
    }
  ];

  return (
    <section className="mb-12">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        {t('faq.title')}
      </h3>
      <div className="space-y-4 max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <Collapsible key={index} className="border border-border rounded-lg overflow-hidden">
            <CollapsibleTrigger 
              className="flex items-center justify-between w-full p-6 text-left hover:bg-accent/50 transition-colors"
              data-testid={`button-${faq.testId}`}
            >
              <span className="font-medium text-foreground">{faq.question}</span>
              <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform duration-200 data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent 
              className="px-6 pb-6 text-muted-foreground"
              data-testid={`content-${faq.testId}`}
            >
              {faq.answer}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </section>
  );
}
