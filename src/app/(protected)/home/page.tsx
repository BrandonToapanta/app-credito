import { auth } from '@/auth';

import { Page } from '@/components/PageLayout';
import { Pay } from '@/components/Pay';
import { Transaction } from '@/components/Transaction';
import { UserInfo } from '@/components/UserInfo';
import { Verify } from '@/components/Verify';
import { ViewPermissions } from '@/components/ViewPermissions';
import { Marble, TopBar } from '@worldcoin/mini-apps-ui-kit-react';
import TablaRegistros from '@/components/TablaRegistros/TablaRegistros';

import prisma from "@/lib/prisma";
import SemiCircleProgressBar from '@/components/ProgressSemiCircle';
import PendingBalances from '@/components/TableDeudasPrestador';

export default async function Home() {
  const session = await auth();

  const scor_credit = await prisma.user.findFirst({
    where: { username: session?.user.username },
    select: {
      score_credit: true,
    },
  });

  console.log(scor_credit);



  return (
    <>
      <Page.Header className="p-0 text-black">
        <TopBar
          title="Home"
          endAdornment={
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold capitalize">
                {session?.user.username}
              </p>
              <Marble src={session?.user.profilePictureUrl} className="w-12" />
            </div>
          }
        />
      </Page.Header>
      <Page.Main className="flex flex-col items-center justify-start gap-4 mb-16 bg-white text-black">
        <SemiCircleProgressBar
          value={scor_credit?.score_credit ?? 650} // Ejemplo: 700 (amarillo)
          size={200}
          strokeWidth={12}
          secondaryColor="#D1D5DB" // Gris
        />

        <PendingBalances />
      </Page.Main>
    </>
  );
}
