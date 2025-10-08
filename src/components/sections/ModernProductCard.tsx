import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Settings, Phone, Download, Eye, ArrowRight } from 'lucide-react';
import { useCTA } from '@/hooks/useCTA';
import { useLanguage } from '@/contexts/LanguageContext';

interface Product {
  id: number;
  name: string;
  category: string;
  power: string;
  cylinders: string;
  fuel: string;
  brand: string;
  image: string;
  description: string;
  features: string[];
  applications: string[];
  warranty: string;
  pdf: string;
}

interface ModernProductCardProps {
  product: Product;
}

const ModernProductCard = ({ product }: ModernProductCardProps) => {
  const { language, t, dir } = useLanguage();
  const { showQuoteMessage, showContactMessage } = useCTA();

  return (
    <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 bg-white border-gray-200 overflow-hidden">
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Overlay with Quick Actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 flex gap-2">
            <Button size="sm" className="bg-white text-gray-900 hover:bg-gray-100 flex-1">
              <Eye className="w-4 h-4 mr-1" />
              {language === 'fa' ? 'مشاهده' : 'View'}
            </Button>
            <Button size="sm" variant="outline" className="bg-white/20 border-white text-white hover:bg-white hover:text-gray-900">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Power Badge */}
        <div className="absolute top-4 right-4">
          <Badge className="bg-blue-600 text-white font-semibold">
            <Zap className="w-3 h-3 mr-1" />
            {product.power}
          </Badge>
        </div>
        
        {/* Brand Badge */}
        <div className="absolute top-4 left-4">
          <Badge variant="outline" className="bg-white/90 text-gray-900 border-gray-300">
            {product.brand}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
              {product.name}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {product.description}
            </p>
          </div>

          {/* Technical Specs */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-gray-600">{t('products.cylinders')}:</span>
              <span className="font-medium">{product.cylinders}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span className="text-gray-600">{t('products.fuel')}:</span>
              <span className="font-medium">{product.fuel}</span>
            </div>
          </div>

          {/* Key Features */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
              <Settings className="w-4 h-4" />
              {t('products.features')}:
            </h4>
            <ul className="space-y-1">
              {product.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="line-clamp-1">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Applications */}
          <div className="flex flex-wrap gap-1">
            {product.applications.slice(0, 3).map((app, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {app}
              </Badge>
            ))}
          </div>

          {/* Warranty */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Settings className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <span className="text-gray-600">{t('products.warranty')}: </span>
                <span className="font-medium text-green-600">{product.warranty}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex flex-col gap-3">
        <div className="flex gap-2 w-full">
          <Button className="bg-blue-600 hover:bg-blue-700 flex-1 group/btn" onClick={showQuoteMessage}>
            <Phone className="w-4 h-4 mr-1" />
            {t('common.getQuote')}
            <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
          <Button variant="outline" size="sm" className="px-3" onClick={showContactMessage}>
            <Download className="w-4 h-4" />
          </Button>
        </div>
        
        <Button variant="ghost" size="sm" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50">
          {t('common.learnMore')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ModernProductCard;