'use client';

import Image from 'next/image';
import a2 from '../../../../../public/assists/images/a2.jpg';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Instanthelp = () => {
    return (
        <div className="mt-20 px-4 sm:px-6 lg:px-24">
            <div className="flex flex-col md:flex-row items-stretch gap-8">

                {/* Text and Image Section */}
                <div className="w-full md:w-1/2 flex flex-col space-y-4">
                    <div>
                        <p className="text-sm tracking-widest mb-4">02</p>
                        <p className="text-orange-500 uppercase tracking-wider">Instant Help</p>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif">How Can We Help You?</h1>
                        <p className="text-gray-500">
                            We understand that you have questions, and we welcome them. Below is a collection of queries that frequently come from our clients.
                        </p>
                    </div>
                    {/* Push image to align bottom */}
                    <div className="mt-auto">
                        <Image
                            src={a2}
                            alt="Instant Help"
                            width={400}
                            height={300}
                            className="rounded-lg shadow-md w-full h-auto object-cover"
                        />
                    </div>
                </div>

                {/* Accordion Section */}
                <div className="w-full md:w-1/2 flex flex-col">
                    <Accordion type="single" collapsible className="flex-1">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-base sm:text-lg font-medium py-7 px-4">
                                Is it accessible?
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600 py-7 px-4">
                                Yes. It adheres to the WAI-ARIA design pattern.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger className="text-base sm:text-lg font-medium py-7 px-4">
                                How do I customize it?
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600 py-7 px-4">
                                You can easily customize colors, spacing, and layout via Tailwind classes or theming.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger className="text-base sm:text-lg font-medium py-7 px-4">
                                Can I use it in production?
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600 py-7 px-4">
                                Absolutely! It’s built with performance and scalability in mind.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger className="text-base sm:text-lg font-medium py-7 px-4">
                                What meal types are available?
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600 py-7 px-4">
                                We offer a variety of meal types including breakfast, lunch, dinner, and snacks, all crafted to suit your dietary preferences.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-5">
                            <AccordionTrigger className="text-base sm:text-lg font-medium py-7 px-4">
                                Do you offer delivery?
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600 py-7 px-4">
                                Yes, we deliver to selected areas within the city. You can check delivery availability at checkout.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-6">
                            <AccordionTrigger className="text-base sm:text-lg font-medium py-7 px-4">
                                How can I track my order?
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600 py-7 px-4">
                                Once your order is confirmed, you'll receive a tracking link via email to monitor its progress.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

            </div>
        </div>
    );
};

export default Instanthelp;
