import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Zap, Building } from 'lucide-react';
import { useMediaUrl } from '@/hooks/useMediaUrl';

interface Project {
  id: number;
  title: string;
  location: string;
  capacity: string;
  year: string;
  image: string;
  description: string;
  client: string;
}

interface ProjectCardProps { project: Project | any; }

const ProjectCard = ({ project }: ProjectCardProps) => {
  const coverUrl = useMediaUrl(
    project.mediaType === 'video' ? project.videoUrl : (project.imageUrl || project.image)
  );
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white overflow-hidden">
      <div className="relative overflow-hidden">
        {project.mediaType === 'video' && coverUrl ? (
          <video className="w-full h-64 object-cover" controls poster={project.posterUrl || undefined} playsInline preload="metadata">
            <source src={coverUrl} />
          </video>
        ) : (
          <img 
            src={coverUrl || project.image || project.imageUrl} 
            alt={project.title}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <Badge className="bg-blue-600 text-white mb-2">
            <Zap className="w-3 h-3 mr-1" />
            {project.capacity}
          </Badge>
          <h3 className="text-white text-xl font-bold mb-1">
            {project.title}
          </h3>
        </div>
      </div>

      <CardContent className="p-6">
        <p className="text-gray-600 mb-4 line-clamp-2">
          {project.description}
        </p>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>{project.location}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>سال اجرا: {project.year}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Building className="w-4 h-4 text-blue-600" />
            <span>کارفرما: {project.client}</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
            مشاهده جزئیات پروژه ←
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;