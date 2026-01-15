import YatraCarousel from '@/components/register/YatraCarousel';
import { Yatra } from '@/types';

interface HomeClientProps {
  yatras: Yatra[];
}

export default function HomeClient({ yatras }: HomeClientProps) {
 
  return (
    <div className="animate-fade-in">
      {/* Hero Banner with Yatra Carousel */}
      {yatras.length > 0 && (
        <div className="w-screen max-w-full">
          <YatraCarousel yatras={yatras} />
        </div>
      )}
    </div>
  );
}

