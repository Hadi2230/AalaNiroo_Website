import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Settings, Phone } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  power: string;
  image: string;
  description: string;
  features: string[];
  price: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-gray-200">
      <div className="relative overflow-hidden rounded-t-lg">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <Badge className="bg-blue-600 text-white">
            <Zap className="w-3 h-3 mr-1" />
            {product.power}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            ویژگی‌های کلیدی:
          </h4>
          <ul className="space-y-1">
            {product.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex justify-between items-center">
        <div className="text-lg font-bold text-blue-600">
          {product.price}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            جزئیات بیشتر
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Phone className="w-4 h-4 mr-1" />
            استعلام قیمت
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;