import { AlertTriangle } from "lucide-react";
import React from "react";

const NotImplementedPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-white via-blue-50 to-indigo-100 p-4 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white/80 p-8 shadow-xl dark:border-slate-700 dark:bg-slate-800/80">
        <AlertTriangle className="mb-4 h-16 w-16 text-yellow-500" />
        <h1 className="mb-2 text-2xl font-bold text-slate-800 dark:text-white">
          Tính năng chưa được triển khai
        </h1>
        <p className="max-w-md text-center text-slate-600 dark:text-slate-300">
          Trang này hiện chưa được phát triển. Vui lòng quay lại sau hoặc liên
          hệ quản trị viên để biết thêm chi tiết.
        </p>
      </div>
    </div>
  );
};

export default NotImplementedPage;
