import { useState } from 'react';
import { Form, Input, Button, Tabs, message, Alert } from 'antd';
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';

const schema = z.object({
  username: z.string().min(3, 'Tối thiểu 3 ký tự').max(30),
  password: z.string().min(6, 'Tối thiểu 6 ký tự'),
});

type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useAuthStore();
  const [messageApi, contextHolder] = message.useMessage();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      activeTab === 'login' ? authApi.login(data) : authApi.register(data),
    onSuccess: (res, variables) => {
      const token = res.data.access_token;
      login(token, variables.username);
      messageApi.success(activeTab === 'login' ? 'Đăng nhập thành công!' : 'Đăng ký thành công!');
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || 'Đã có lỗi xảy ra';
      setErrorMsg(typeof msg === 'string' ? msg : msg.join(', '));
    },
  });

  const onSubmit = (data: FormData) => {
    setErrorMsg('');
    mutation.mutate(data);
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key as 'login' | 'register');
    setErrorMsg('');
    reset();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-8 bg-surface animate-fade-in">
      {contextHolder}

      {/* Logo */}
      <div className="mb-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-primary-500/20">
          <SafetyCertificateOutlined className="text-white text-2xl" />
        </div>
        <h1 className="text-xl font-bold text-slate-100">Easy 2FA Saver</h1>
        <p className="text-xs text-slate-500 mt-1">Quản lý mã 2FA của bạn</p>
      </div>

      {/* Tabs */}
      <div className="w-full">
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          centered
          items={[
            { key: 'login', label: 'Đăng nhập' },
            { key: 'register', label: 'Đăng ký' },
          ]}
          className="mb-4"
        />

        {errorMsg && (
          <Alert
            message={errorMsg}
            type="error"
            showIcon
            className="mb-4 text-xs"
            closable
            onClose={() => setErrorMsg('')}
          />
        )}

        <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className="space-y-1">
          {/* Username */}
          <Form.Item
            validateStatus={errors.username ? 'error' : ''}
            help={errors.username?.message}
          >
            <Controller
              name="username"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<UserOutlined className="text-slate-500" />}
                  placeholder="Tên đăng nhập"
                  size="large"
                  autoComplete="username"
                />
              )}
            />
          </Form.Item>

          {/* Password */}
          <Form.Item
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input.Password
                  {...field}
                  prefix={<LockOutlined className="text-slate-500" />}
                  placeholder="Mật khẩu"
                  size="large"
                  autoComplete={activeTab === 'login' ? 'current-password' : 'new-password'}
                />
              )}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={mutation.isPending}
            className="!mt-4 !h-11 !font-semibold"
          >
            {activeTab === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </Button>
        </Form>
      </div>
    </div>
  );
}
