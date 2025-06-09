import { clientMenuItems } from '@/libs/atvsld/components/AuthFeature/handleAuthFeature';
import Sidebar from '@/libs/atvsld/components/Sidebar'
import React from 'react'

export default function ReportPage() {
  return (
    <div className="w-screen h-screen">
          <Sidebar menuItems={clientMenuItems} />
          <main className="pl-80 bg-[url('/img/background.jpg')] bg-cover bg-no-repeat bg-center h-screen">
              <div className='flex flex-col items-center justify-start h-full'>
                    <h1 className="text-2xl font-bold text-center mt-10">Báo cáo ATVSLD</h1>
                    <p className="text-center mt-4">Đang cập nhật...</p>
            </div>
          </main>
    </div>
  );
}
