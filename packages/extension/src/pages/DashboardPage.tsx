import { useState } from 'react';
import { Input, Empty, Spin, Button } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsApi, type Account } from '@/services/api';
import { AccountCard } from '@/components/AccountCard';
import { Layout } from '@/components/Layout';
import { useNavigate } from 'react-router-dom';

export function DashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data: accounts = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountsApi.getAll().then((r) => r.data),
    refetchInterval: 60_000, // refetch every 60s just in case
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => accountsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  const filtered = accounts.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Layout>
      <div className="flex flex-col h-full">
        {/* Search bar */}
        <div className="px-3 pt-3 pb-2 flex-shrink-0">
          <Input
            prefix={<SearchOutlined className="text-slate-500" />}
            placeholder="Tìm kiếm tài khoản..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            size="middle"
            className="!bg-surface-tertiary !border-surface-border"
          />
        </div>

        {/* Account list */}
        <div className="flex-1 scroll-area px-3 pb-3 space-y-2">
          {isLoading && (
            <div className="flex items-center justify-center h-40">
              <Spin size="large" tip="Đang tải..." />
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center justify-center h-40 gap-3 text-center">
              <p className="text-slate-500 text-sm">Không thể kết nối đến server</p>
              <Button
                size="small"
                icon={<ReloadOutlined />}
                onClick={() => refetch()}
                className="!text-xs"
              >
                Thử lại
              </Button>
            </div>
          )}

          {!isLoading && !isError && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 gap-2">
              {search ? (
                <p className="text-slate-500 text-sm">Không tìm thấy "{search}"</p>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <span className="text-slate-500 text-sm">
                      Chưa có tài khoản 2FA nào
                    </span>
                  }
                >
                  <Button type="primary" size="small" onClick={() => navigate('/add')}>
                    Thêm ngay
                  </Button>
                </Empty>
              )}
            </div>
          )}

          {!isLoading && !isError &&
            filtered.map((account: Account) => (
              <AccountCard
                key={account._id}
                account={account}
                onEdit={(acc) => navigate('/edit', { state: { account: acc } })}
                onDelete={(id) => deleteMutation.mutate(id)}
              />
            ))}
        </div>

        {/* Footer: account count */}
        {accounts.length > 0 && (
          <div className="px-3 py-1.5 border-t border-surface-border flex-shrink-0">
            <p className="text-xs text-slate-600 text-center">
              {accounts.length} tài khoản · Mã làm mới mỗi 30 giây
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
