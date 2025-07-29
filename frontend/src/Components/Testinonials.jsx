import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    text: "We are very pleased with the website created by Regenta International Technologies for Minpatna.com, our nursing and paramedical college. Their team comprehensively understood our needs and delivered a website that is both visually impressive and user-friendly.",
    name: "Prem Kumar",
    title: "Founder & CEO of MIN Patna",
  },
  {
    text: "Working with Regenta International Technologies on our eCommerce Android app has been fantastic. Their team's expertise and dedication resulted in a high-quality, user-friendly app that perfectly meets our needs. I confidently recommend Regenta International Technologies for any eCommerce app development project.",
    name: "Abhilash Maithani",
    title: "Founder & CEO of Garhwal Mobile",
  },
  {
    text: "I'm thrilled with the website Regenta International Technologies developed for my white labeling business. They understood my needs and created a user-friendly site. I highly recommend Regenta International Technologies for top-notch website development.",
    name: "Rewati",
    title: "Founder & CEO of Rewati Hitech",
  },
  {
    text: "The team at Regenta International is excellent. They delivered exactly what we wanted and provided outstanding support throughout the development process.",
    name: "Rohit Sharma",
    title: "Business Owner",
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="bg-blue-50 py-16">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-2">
          Our <span className="text-blue-600">Testimonials</span>
        </h2>
        <p className="text-gray-600 mb-8">
          Discover what our clients have to say about their experience working with Regenta International Technologies.
        </p>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="h-full"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index} className="flex h-full">
              <div className="bg-white shadow-lg rounded-xl p-6 text-left flex flex-col justify-between w-full h-full min-h-[320px]">
                {/* Stars */}
                <div>
                  <div className="flex text-yellow-400 mb-3">
                    {Array(5)
                      .fill()
                      .map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                  </div>
                  <p className="text-gray-700 mb-4">{testimonial.text}</p>
                </div>

                {/* Name & Title */}
                <div>
                  <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.title}</p>
                </div>

                {/* Quote Mark */}
                <div className="text-5xl text-blue-100 absolute bottom-4 right-4">&rdquo;</div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;