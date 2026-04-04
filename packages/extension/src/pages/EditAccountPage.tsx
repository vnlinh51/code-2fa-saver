import { Form, Input, Button, Alert } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsApi } from '@/services/api';
import { Layout } from '@/components/Layout';
import { useNavigate, useLocation } from 'react-router-dom';
import { TagOutlined, LinkOutlined } from '@ant-design/icons';
import type { Account } from '@/services/api';
import { useState } from 'react';

const schema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên tài khoản').max(50),
  url: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

export function EditAccountPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const account = location.state?.account as Account | undefined;
  const [errorMsg, setErrorMsg] = useState('');

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: account?.name || '',
      url: account?.url || '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      accountsApi.update(account!._id, {
        name: data.name,
        url: data.url || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      navigate('/');
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || 'Cập nhật thất bại';
      setErrorMsg(typeof msg === 'string' ? msg : msg.join(', '));
    },
  });

  if (!account) {
    navigate('/');
    return null;
  }

  return (
    <Layout>
      <div className="px-4 py-4 animate-slide-up">
        <h2 className="text-base font-bold text-slate-200 mb-1">Sửa tài khoản</h2>
        <p className="text-xs text-slate-500 mb-4">
          Chỉ có thể sửa tên và URL. Secret không thể thay đổi.
        </p>

        {errorMsg && (
          <Alert
            message={errorMsg}
            type="error"
            showIcon
            closable
            onClose={() => setErrorMsg('')}
            className="mb-4 text-xs"
          />
        )}

        <Form layout="vertical" onFinish={handleSubmit((data) => mutation.mutate(data))}>
          <Form.Item
            label={<span className="text-slate-400 text-xs font-medium">Tên tài khoản *</span>}
            validateStatus={errors.name ? 'error' : ''}
            help={errors.name?.message}
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<TagOutlined className="text-slate-500" />}
                  placeholder="Tên tài khoản"
                  size="middle"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-slate-400 text-xs font-medium">Website URL (tùy chọn)</span>}
            validateStatus={errors.url ? 'error' : ''}
            help={errors.url?.message}
          >
            <Controller
              name="url"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<LinkOutlined className="text-slate-500" />}
                  placeholder="https://example.com"
                  size="middle"
                />
              )}
            />
          </Form.Item>

          <div className="flex gap-2 mt-2">
            <Button block onClick={() => navigate('/')}>
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={mutation.isPending}
              className="!font-semibold"
            >
              Lưu thay đổi
            </Button>
          </div>
        </Form>
      </div>
    </Layout>
  );
}
