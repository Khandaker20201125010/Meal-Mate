import ContactBg from '@/src/app/Components/ContactBg/ContactBg';
import ContactBody from '@/src/app/Components/ContactBody/ContactBody';
import ContactCard from '@/src/app/Components/ContactBody/ContactCard';
import ContactFooter from '@/src/app/Components/ContactBody/ContactFooter';
import React from 'react';

const page = () => {
    return (
        <div>
            <ContactBg></ContactBg>
            <ContactCard></ContactCard>
            <ContactBody></ContactBody>
            <ContactFooter></ContactFooter>
        </div>
    );
};

export default page;