import { Form, Input, Button, Alert } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsApi } from '@/services/api';
import { Layout } from '@/components/Layout';
import { useNavigate } from 'react-router-dom';
import { KeyOutlined, TagOutlined, LinkOutlined } from '@ant-design/icons';
import { useState } from 'react';

const schema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên tài khoản').max(50),
  secret: z
    .string()
    .min(16, 'Secret tối thiểu 16 ký tự')
    .regex(/^[A-Z2-7\s=]+$/i, 'Secret không hợp lệ (Base32)'),
  url: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

export function AddAccountPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState('');

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', secret: '', url: '' },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      accountsApi.create({
        name: data.name,
        secret: data.secret.replace(/\s/g, '').toUpperCase(),
        url: data.url || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      navigate('/');
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || 'Thêm tài khoản thất bại';
      setErrorMsg(typeof msg === 'string' ? msg : msg.join(', '));
    },
  });

  return (
    <Layout>
      <div className="px-4 py-4 animate-slide-up">
        <h2 className="text-base font-bold text-slate-200 mb-1">Thêm tài khoản 2FA</h2>
        <p className="text-xs text-slate-500 mb-4">
          Tìm secret key trong phần cài đặt bảo mật của ứng dụng
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
          {/* Name */}
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
                  placeholder="VD: Google, GitHub, Facebook"
                  size="middle"
                />
              )}
            />
          </Form.Item>

          {/* Secret */}
          <Form.Item
            label={<span className="text-slate-400 text-xs font-medium">Secret Key *</span>}
            validateStatus={errors.secret ? 'error' : ''}
            help={errors.secret?.message}
            extra={
              <span className="text-xs text-slate-600">
                Chuỗi Base32 từ QR code của ứng dụng
              </span>
            }
          >
            <Controller
              name="secret"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<KeyOutlined className="text-slate-500" />}
                  placeholder="JBSWY3DPEHPK3PXP"
                  size="middle"
                  className="!font-mono !tracking-wider"
                />
              )}
            />
          </Form.Item>

          {/* URL */}
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
            <Button
              block
              onClick={() => navigate('/')}
              className="!font-medium"
            >
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={mutation.isPending}
              className="!font-semibold"
            >
              Lưu
            </Button>
          </div>
        </Form>
      </div>
    </Layout>
  );
}
