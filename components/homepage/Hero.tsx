'use client';

import { useLanguage } from '@/app/context/LanguageContext';

import React from 'react';
import SimpleMap from './SimpleMap';
import { Billboard } from '@/types';

const Hero: React.FC<{ billboards: Billboard[] }> = ({ billboards }) => {
  const { t } = useLanguage();

  return (
    <div className="text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
        {t('homepage.hero.title')}
      </h1>
      <p className="mt-4 max-w-3xl mx-auto text-gray-600">
        {t('homepage.hero.subtitle')}
      </p>
      <div className="mt-8">
        <SimpleMap billboards={billboards} />
      </div>
    </div>
  );
};

export default Hero;
