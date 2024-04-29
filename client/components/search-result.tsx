import React from 'react';
import Link from 'next/link'; // Next.js의 Link 컴포넌트를 임포트합니다.

export function SearchResult() {
  // 대학의 고유 코드 (나중에 DB에서 받아와 사용할 수 있음)
  const universityCode = 'skku'; // 현재는 'skku'로 고정되어 있으나, DB 연결 후 동적으로 변경 가능

  return (
    <Link href={`/exchange/${universityCode}`}> {}
      <div className="block text-left"> {}
        <div className="max-w-full mx-auto p-4 bg-white flex justify-between items-center hover:bg-gray-100 transition-colors duration-150 rounded-lg cursor-pointer">
          {/* Left Section */}
          <div>
            <h2 className="text-2xl font-bold mb-1.5">Sungkyunkwan University</h2>
            <p className="text-muted font-semibold">Seoul, South Korea | Suwon Campus | F2 Visa</p>
          </div>

          {/* Right Section */}
          <div className="text-right">
            <p className="text-muted font-semibold">QS Ranking: 115</p>
            <p className="text-muted font-semibold">Dormitory: Available</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
