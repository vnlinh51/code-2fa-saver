import { useState } from 'react';
import { Button, Tooltip, Popconfirm, message } from 'antd';
import { CopyOutlined, CheckOutlined, EditOutlined, DeleteOutlined, LinkOutlined } from '@ant-design/icons';
import type { Account } from '@/services/api';
import { useTotp } from '@/hooks/useTotp';
import { CountdownBar } from './CountdownBar';

interface AccountCardProps {
  account: Account;
  onEdit: (account: Account) => void;
  onDelete: (id: string) => void;
}

export function AccountCard({ account, onEdit, onDelete }: AccountCardProps) {
  const { code, secondsLeft, progress } = useTotp(account.secret);
  const [copied, setCopied] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const formattedCode = `${code.slice(0, 3)} ${code.slice(3)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      messageApi.success('Đã copy mã!', 1.5);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      messageApi.error('Không thể copy');
    }
  };

  return (
    <div className="glass-card p-3 animate-fade-in group hover:border-primary-500/30 transition-all duration-200">
      {contextHolder}
      <div className="flex items-start justify-between mb-2">
        {/* Name + URL */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-200 truncate">{account.name}</p>
          {account.url && (
            <a
              href={account.url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-500 hover:text-primary-500 transition-colors flex items-center gap-1 truncate"
            >
              <LinkOutlined style={{ fontSize: 10 }} />
              {account.url.replace(/^https?:\/\//, '')}
            </a>
          )}
        </div>

        {/* Actions — visible on hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
          <Tooltip title="Sửa">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              className="!text-slate-400 hover:!text-blue-400 !h-6 !w-6 !min-w-0 !p-0"
              onClick={() => onEdit(account)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa tài khoản?"
            description="Hành động này không thể hoàn tác."
            onConfirm={() => onDelete(account._id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                className="!text-slate-400 hover:!text-red-400 !h-6 !w-6 !min-w-0 !p-0"
              />
            </Tooltip>
          </Popconfirm>
        </div>
      </div>

      {/* TOTP Code + Copy */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-code text-2xl font-bold tracking-widest text-primary-500 select-all">
          {formattedCode}
        </span>
        <Tooltip title={copied ? 'Đã copy!' : 'Copy mã'}>
          <Button
            type="primary"
            size="small"
            icon={copied ? <CheckOutlined /> : <CopyOutlined />}
            onClick={handleCopy}
            className={`!h-8 !px-3 transition-all ${copied ? '!bg-green-600 !border-green-600' : ''}`}
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </Tooltip>
      </div>

      {/* Countdown bar */}
      <CountdownBar progress={progress} secondsLeft={secondsLeft} />
    </div>
  );
}
