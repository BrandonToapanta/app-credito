'use client';

import { TabItem, Tabs } from '@worldcoin/mini-apps-ui-kit-react';
import { Bank, Home, User } from 'iconoir-react';
import { useState } from 'react';
import { List } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * This component uses the UI Kit to navigate between pages
 * Bottom navigation is the most common navigation pattern in Mini Apps
 * We require mobile first design patterns for mini apps
 * Read More: https://docs.world.org/mini-apps/design/app-guidelines#mobile-first
 */

export const Navigation = () => {
  const [value, setValue] = useState('home');
  const router = useRouter();

  const handleChange = (val: string) => {
    setValue(val);
    router.push(`/${val}`);
  };

  return (
    <Tabs value={value} onValueChange={handleChange}>
      <TabItem value="home" icon={<Home />} label="Home" />
      {/* // TODO: These currently don't link anywhere */}
      <TabItem value="registros" icon={<List />} label="Registros" />
      <TabItem value="profile" icon={<User />} label="Profile" />
    </Tabs>
  );
};
