import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface Service {
  id: number;
  title: string;
  icon: string;
  description: string;
  features: string[];
}

interface ServiceCardProps {
  service: Service;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-gray-200 h-full">
      <CardContent className="p-8 flex flex-col h-full">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
            {service.icon}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
            {service.title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {service.description}
          </p>
        </div>

        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-4">ویژگی‌های خدمت:</h4>
          <ul className="space-y-2 mb-6">
            {service.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3 text-gray-600">
                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto">
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 group-hover:bg-blue-700 transition-colors"
            size="lg"
          >
            درخواست خدمت
            <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;