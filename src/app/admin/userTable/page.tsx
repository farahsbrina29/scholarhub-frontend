'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { userAPI, authAPI } from '@/services/api';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { Box, Typography, Container } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminSidebar from '@/components/admin/SideBar';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function UserTablePage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const allUsers = await userAPI.getAll();
      const onlyUserRole = allUsers.filter((u: User) => u.role === 'USER');
      setUsers(onlyUserRole);
    } catch (error) {
      toast.error('Gagal memuat data user.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const validateAdmin = async () => {
      try {
        const res = await authAPI.me();
        if (res.user?.role !== 'ADMIN') {
          throw new Error('Bukan admin');
        }
        fetchUsers();
      } catch {
        try {
          const refresh = await authAPI.refreshToken();
          if (refresh.user?.role !== 'ADMIN') {
            throw new Error('Bukan admin setelah refresh');
          }
          fetchUsers();
        } catch {
          toast.error('Sesi habis, silakan login ulang');
          setTimeout(() => router.push('/auth/login'), 1500);
        }
      }
    };

    validateAdmin();
  }, [router]);

  const columns = useMemo<MRT_ColumnDef<User>[]>(() => [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
  ], []);

  return (
    <div className="flex min-h-screen">
      <ToastContainer />
      <AdminSidebar />
      <div className="flex-1 p-6 bg-gray-50">
        <Container maxWidth="lg">
          <Typography variant="h4" component="h1" gutterBottom>
            User List
          </Typography>

          <MaterialReactTable
            columns={columns}
            data={users}
            state={{ isLoading: loading }}
            enableColumnFilters
            enablePagination
            enableSorting
            muiTableHeadCellProps={{
              sx: { fontWeight: 'bold' },
            }}
            muiTableBodyCellProps={{
              sx: { fontSize: '14px' },
            }}
          />
        </Container>
      </div>
    </div>
  );
}
