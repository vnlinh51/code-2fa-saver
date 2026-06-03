import { Button, Tooltip } from 'antd';
import { PlusOutlined, LogoutOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, logout } = useAuthStore();
  const isDashboard = location.pathname === '/';

  return (
    <div className="flex flex-col h-full bg-surface">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-surface-border bg-surface-secondary flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
            <SafetyCertificateOutlined className="text-white text-sm" />
          </div>
          <span className="font-semibold text-sm text-slate-200">Easy 2FA</span>
        </div>

        <div className="flex items-center gap-1">
          {isDashboard && (
            <Tooltip title="Thêm tài khoản">
              <Button
                type="primary"
                shape="round"
                size="small"
                icon={<PlusOutlined />}
                onClick={() => navigate('/add')}
                className="!text-xs !h-7 !px-3"
              >
                Thêm
              </Button>
            </Tooltip>
          )}
          {!isDashboard && (
            <Button
              type="text"
              size="small"
              onClick={() => navigate('/')}
              className="!text-slate-400 hover:!text-slate-200 !text-xs"
            >
              ← Quay lại
            </Button>
          )}
          <Tooltip title={`Đăng xuất (${username})`}>
            <Button
              type="text"
              size="small"
              icon={<LogoutOutlined />}
              onClick={logout}
              className="!text-slate-500 hover:!text-red-400 !h-7 !w-7 !min-w-0 !p-0"
            />
          </Tooltip>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 min-h-0 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
