import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Clock, Users, Star, BookOpen } from 'lucide-react';
import { Course } from '@/hooks/useCourses';

interface CourseCardProps {
  course: Course;
  onEnroll?: (courseId: string) => void;
}

export const CourseCard = ({ course, onEnroll }: CourseCardProps) => {
  const handleEnroll = () => {
    if (onEnroll) {
      onEnroll(course.id);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
      <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden">
        {course.thumbnail_url ? (
          <img 
            src={course.thumbnail_url} 
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-primary/60" />
          </div>
        )}
        {course.is_free && (
          <Badge className="absolute top-3 left-3 bg-green-500 hover:bg-green-600">
            Gratuito
          </Badge>
        )}
        {course.difficulty_level && (
          <Badge variant="secondary" className="absolute top-3 right-3">
            {course.difficulty_level}
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </CardTitle>
          <div className="flex items-center gap-1 text-sm text-muted-foreground shrink-0">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>4.8</span>
          </div>
        </div>
        
        <CardDescription className="line-clamp-2">
          {course.short_description || course.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          {course.duration_hours && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration_hours}h</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>1.2k alunos</span>
          </div>
        </div>

        {course.professor && (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={course.professor.avatar_url || undefined} />
              <AvatarFallback>
                {course.professor.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              {course.professor.full_name}
            </span>
          </div>
        )}

        {course.tags && course.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {course.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-primary">
              {course.is_free ? 'Gratuito' : `R$ ${course.price?.toFixed(2)}`}
            </span>
          </div>
          <Button onClick={handleEnroll} size="sm">
            Inscrever-se
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};