"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from 'material-react-table';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Check, Close } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import { scholarRegistAPI, authAPI } from '@/services/api';
import AdminSidebar from '@/components/admin/SideBar';

interface Registration {
  id: number;
  name: string;
  studentId: string;
  email: string;
  studyProgram: string;
  semester: number;
  registDate: string;
  status: string;
  note?: string;
}

export default function ScholarRegistrationsPage() {
  const router = useRouter();
  const params = useParams();
  const scholarId = Array.isArray(params.scholarId) ? params.scholarId[0] : params.scholarId;

  const [data, setData] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      // auth check
      const res = await authAPI.me();
      if (res.user?.role !== 'ADMIN') throw new Error('Access denied');
      // fetch registrations by scholarId
      const all = await scholarRegistAPI.getAll();
      const filtered = all.filter((r: any) => r.scholarId === Number(scholarId));
      setData(filtered);
    } catch (err: any) {
      toast.error('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scholarId) fetchData();
  }, [scholarId]);

  const columns = useMemo<MRT_ColumnDef<Registration>[]>(
    () => [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'studentId', header: 'Student ID' },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'studyProgram', header: 'Program' },
      { accessorKey: 'semester', header: 'Semester' },
      { accessorKey: 'registDate', header: 'Date' },
      { accessorKey: 'status', header: 'Status' },
      { accessorKey: 'note', header: 'Note' },
    ],
    []
  );

  const handleUpdateStatus = async (row: MRT_Row<Registration>, status: 'accepted' | 'rejected') => {
    try {
      await scholarRegistAPI.update(row.original.id, { status });
      toast.success(`Status updated to ${status}`);
      fetchData();
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="flex min-h-screen">
      <ToastContainer />
      <AdminSidebar />
      <div className="flex-1 p-6 bg-gray-50">
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>
            Registrations for Scholar {scholarId}
          </Typography>
          <MaterialReactTable
            columns={columns}
            data={data}
            state={{ isLoading: loading }}
            enableRowActions
            renderRowActions={({ row }) => (
              <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                <Tooltip title="Accept">
                  <IconButton onClick={() => handleUpdateStatus(row, 'accepted')}>
                    <Check color="success" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Reject">
                  <IconButton onClick={() => handleUpdateStatus(row, 'rejected')}>
                    <Close color="error" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          />
        </Container>
      </div>
    </div>
  );
}
