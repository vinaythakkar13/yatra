'use client';

import React from 'react';
import Container from '../common/Container';
import AnimatedSection from '../ui/AnimatedSection';
import SkeletonImage from '../ui/SkeletonImage';

// Swiper React Components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, A11y } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const dummyImages = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=faces&auto=format&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces&auto=format&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=faces&auto=format&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces&auto=format&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=faces&auto=format&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=faces&auto=format&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=faces&auto=format&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=faces&auto=format&q=80',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop&crop=faces&auto=format&q=80',
    'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&h=400&fit=crop&crop=faces&auto=format&q=80',
    'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop&crop=faces&auto=format&q=80',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop&crop=faces&auto=format&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=faces&auto=format&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces&auto=format&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop&crop=faces&auto=format&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces&auto=format&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=faces&auto=format&q=80',
]

const testimonials = [
    {
        quote:
            'Waheguru! This organization is truly doing God\'s work. When my father needed emergency heart surgery, they not only provided free treatment but also ensured our family had langar every day. The doctors here treat patients with such compassion and respect. This is real seva.',
        name: 'Gurpreet Singh',
        role: 'Cardiac Surgery Beneficiary',
    },
    {
        quote:
            'I started receiving The Inside Track during my final semester of university, and it transformed how I approached the job market. The tips on networking, market insights, and interview prep gave me a serious advantage. Within weeks, I landed an interview at a top-tier finance firm.',
        name: 'Emily R.',
        role: 'The youth of rewari',
    },
    {
        quote:
            'Sat Sri Akal! The Ayurveda wing here is a blessing. They treat not just the body but the soul. After years of chronic pain, their holistic approach—medication, meditation, and proper nutrition—has given me a new lease on life. The volunteers here are angels.',
        name: 'Amita Sharma',
        role: 'Chronic Care Patient',
    },
    {
        quote:
            'I am the first in my family to go to college, all thanks to this organization\'s scholarship program. They didn\'t just give me money—they mentored me, believed in me, and showed me that dreams can come true. I am now an engineer, and I will forever be grateful.',
        name: 'Rajesh Kumar',
        role: 'Scholarship Recipient',
    },
    {
        quote:
            'Langar seva here has transformed my life. Every Sunday, I come here to serve, and I leave with a heart full of gratitude. The sense of community, the prayers, the selfless service—this is what humanity should be. I have found my purpose here.',
        name: 'Harpreet Kaur',
        role: 'Langar Volunteer',
    },
    {
        quote:
            'When the medical camp came to our remote village, I thought my daughter wouldn\'t survive. But these doctors saved her life, and they did it for free. They even arranged follow-up care. This organization reaches places where government services don\'t. They are true heroes.',
        name: 'Priya Devi',
        role: 'Rural Healthcare Beneficiary',
    },
    {
        quote:
            'As a regular donor, I have seen firsthand how transparent and impactful this organization is. Every rupee I donate goes directly to those in need. They send detailed reports, photos, and stories. This is how charity should work—with complete transparency and accountability.',
        name: 'Amit Patel',
        role: 'Regular Donor',
    },
    {
        quote:
            'My children were struggling in school because we couldn\'t afford books or a smartphone. This organization provided everything—books, tablets, and even free tutoring. Now my children are top performers. Education is a right, not a privilege, and they make it accessible.',
        name: 'Sunita Mehta',
        role: 'Parent & Beneficiary',
    },
    {
        quote:
            'I have been volunteering here for five years, and every day I learn something new about compassion and selfless service. The smiles, the gratitude, the transformation I see in people\'s lives—this is what keeps me coming back. This is true seva, true humanity.',
        name: 'Manpreet Singh',
        role: 'Long-term Volunteer',
    },
    {
        quote:
            'During the floods, when our entire village was underwater, this organization was the first to arrive. They brought food, medicine, clothes, and hope. They didn\'t just give us supplies—they gave us strength. They stayed with us until we could rebuild. This is divine service.',
        name: 'Vikram Yadav',
        role: 'Disaster Relief Beneficiary',
    },
    {
        quote:
            'I had lost all hope when I went blind. My family couldn\'t afford surgery. But this organization gave me free eye surgery, and now I can see again. I can work, I can support my family, I can see my grandchildren. This is a miracle, and they made it happen.',
        name: 'Kamla Devi',
        role: 'Medical Camp Patient',
    },
    {
        quote:
            'The women empowerment program didn\'t just teach me skills—it gave me confidence. I started my own tailoring business with their support and micro-loan. Today, I employ three other women. This organization doesn\'t just help—it creates change-makers.',
        name: 'Kavita Sharma',
        role: 'Women Empowerment Program',
    },
    {
        quote:
            'My elderly mother lives alone, and I was worried about her health. This organization\'s mobile medical van visits her every month. The doctors check her, give her medicines, and even call me to update. This is care beyond expectations. They treat everyone like family.',
        name: 'Ramesh Choudhary',
        role: 'Mobile Medical Van User',
    },
    {
        quote:
            'I was lost after high school, didn\'t know what to do. The youth mentorship program here guided me through college applications, helped me choose the right career, and even helped me get scholarships. Today, I am a software engineer. They didn\'t just help me—they changed my destiny.',
        name: 'Anjali Verma',
        role: 'Youth Mentorship Program',
    },
    {
        quote:
            'During COVID, when my husband lost his job and we had no income, this organization provided us with groceries, medicines, and even helped pay our rent for three months. They didn\'t just give us supplies—they gave us hope. This is what humanity looks like.',
        name: 'Mohammed Ali',
        role: 'COVID Relief Beneficiary',
    },
    {
        quote:
            'I was working as a daily wage laborer, struggling to make ends meet. The free computer training program here changed everything. I learned coding, got certified, and now I have a stable IT job. This organization doesn\'t just give—it empowers. It transforms lives.',
        name: 'Deepak Joshi',
        role: 'Skill Development Program',
    },
    {
        quote:
            'I have been teaching at their free school for three years, and I see miracles every day. Children who had never seen a classroom are now dreaming of becoming doctors and engineers. The resources, the support, the love—this is education at its finest. This is seva in action.',
        name: 'Sarita Nair',
        role: 'Free School Teacher',
    },
    {
        quote:
            'When I lost my job and couldn\'t afford my mother\'s cancer treatment, I thought all was lost. But this organization stepped in, provided free treatment, and even helped me find a new job. They saved my mother\'s life and gave me hope. This is divine intervention.',
        name: 'Sandeep Malhotra',
        role: 'Cancer Treatment Beneficiary',
    },
    {
        quote:
            'The elderly care program here is exceptional. They don\'t just provide medical care—they provide companionship, respect, and dignity. My father, who is 85, looks forward to their visits. They treat him like their own family. This is what seva truly means.',
        name: 'Neha Kapoor',
        role: 'Elderly Care Program',
    },
];

export default function TestimonialsSection() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-spiritual-zen-surface relative overflow-hidden">
      <Container className="relative z-10">
        <AnimatedSection animation="fadeInUp" className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-spiritual-navy">
            Voices from Our Community
          </h2>
        </AnimatedSection>

        <Swiper
          modules={[Autoplay, Pagination, A11y]}
          spaceBetween={24}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={800}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          pagination={{ clickable: true }}
          className="pb-12"
        >
          {testimonials.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="group relative bg-white rounded-2xl border border-spiritual-zen-highlight shadow-lg hover:shadow-xl transition-all duration-300 p-6 md:p-8 flex flex-col h-full">
                {/* Profile Image */}
                <div className="flex justify-center mb-4">
                  <div className="relative w-20 h-20 md:w-24 md:h-24">
                    <SkeletonImage
                      src={dummyImages[index % dummyImages.length]}
                      alt={item.name}
                      width={96}
                      height={96}
                      className="rounded-full object-cover w-full h-full border-4 border-white shadow-md"
                    />
                  </div>
                </div>

                {/* Quote Icon */}
                <div className="flex justify-center mb-4">
                  <svg className="w-12 h-12 text-spiritual-zen-highlight opacity-70" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                {/* Quote */}
                <p className="text-spiritual-text text-sm md:text-base leading-relaxed text-center flex-1">
                  {item.quote}
                </p>

                {/* Author */}
                <div className="text-right pt-4 mt-4 border-t border-spiritual-zen-highlight">
                  <p className="text-sm font-semibold text-spiritual-navyDark">— {item.name}</p>
                  {item.role && <p className="text-xs text-spiritual-textLight mt-1">{item.role}</p>}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </section>
  );
}