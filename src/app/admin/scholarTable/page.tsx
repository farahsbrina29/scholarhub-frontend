"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from 'material-react-table';
import {
  Box,
  Button,
  Container,
  Typography,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Delete, Edit, Person } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import { scholarAPI, authAPI } from '@/services/api';
import AdminSidebar from '@/components/admin/SideBar';

interface Scholar {
  id: string;
  scholarName: string;
  description: string;
  category: string;
  scholarRequirement: string;
  contact: string;
  startDate: string;
  endDate: string;
}

export default function ScholarTablePage() {
  const router = useRouter();
  const [data, setData] = useState<Scholar[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRow, setEditingRow] = useState<MRT_Row<Scholar> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Scholar, 'id'>>({
    scholarName: '',
    description: '',
    category: '',
    scholarRequirement: '',
    contact: '',
    startDate: '',
    endDate: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await scholarAPI.getAll();
      setData(result);
    } catch {
      toast.error('Fail fetch scholars');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const validateAdmin = async () => {
      try {
        const res = await authAPI.me();
        if (res.user?.role !== 'ADMIN') throw new Error('Access denied');
        fetchData();
      } catch {
        try {
          const refreshed = await authAPI.refreshToken();
          if (refreshed.user?.role !== 'ADMIN') throw new Error('Access denied');
          fetchData();
        } catch {
          toast.error('Access denied');
          setTimeout(() => router.push('/auth/login'), 1500);
        }
      }
    };
    validateAdmin();
  }, [router]);

  const columns = useMemo<MRT_ColumnDef<Scholar>[]>(
    () => [
      { accessorKey: 'scholarName', header: 'Scholar Name' },
      { accessorKey: 'description', header: 'Description' },
      { accessorKey: 'category', header: 'Category' },
      { accessorKey: 'scholarRequirement', header: 'Requirement' },
      { accessorKey: 'contact', header: 'Contact' },
      { accessorKey: 'startDate', header: 'Start Date' },
      { accessorKey: 'endDate', header: 'End Date' },
    ],
    []
  );

  const handleOpenDialog = (row?: MRT_Row<Scholar>) => {
    if (row) {
      setEditingRow(row);
      setFormData({
        scholarName: row.original.scholarName,
        description: row.original.description,
        category: row.original.category,
        scholarRequirement: row.original.scholarRequirement,
        contact: row.original.contact,
        startDate: row.original.startDate,
        endDate: row.original.endDate,
      });
    } else {
      setEditingRow(null);
      setFormData({
        scholarName: '',
        description: '',
        category: '',
        scholarRequirement: '',
        contact: '',
        startDate: '',
        endDate: '',
      });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingRow) {
        await scholarAPI.update(editingRow.original.id, formData);
        toast.success('Scholar updated');
      } else {
        await scholarAPI.create(formData);
        toast.success('Scholar added');
      }
      setDialogOpen(false);
      fetchData();
    } catch {
      toast.error('Fail save data');
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm('Are you sure delete this scholar?');
    if (!confirm) return;
    try {
      await scholarAPI.delete(id);
      toast.success('Delete success');
      fetchData();
    } catch {
      toast.error('Delete fail');
    }
  };

  return (
    <div className="flex min-h-screen">
      <ToastContainer />
      <AdminSidebar />
      <div className="flex-1 p-6 bg-gray-50">
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>
            Scholars Management
          </Typography>

          <MaterialReactTable
            columns={columns}
            data={data}
            state={{ isLoading: loading }}
            enableColumnActions
            enableRowActions
            renderRowActions={({ row }) => (
              <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                <Tooltip title="Edit">
                  <IconButton onClick={() => handleOpenDialog(row)}>
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton onClick={() => handleDelete(row.original.id)}>
                    <Delete />
                  </IconButton>
                </Tooltip>
                <Tooltip title="View Registrations">
                  <IconButton onClick={() => router.push(`/admin/scholarTable/${row.original.id}`)}>
                    <Person />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
            renderTopToolbarCustomActions={() => (
              <Button variant="contained" onClick={() => handleOpenDialog()}>
                Add Scholar
              </Button>
            )}
          />

          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>{editingRow ? 'Edit Scholarship' : 'Add Scholarship'}</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Scholar Name"
                value={formData.scholarName}
                onChange={(e) => setFormData({ ...formData, scholarName: e.target.value })}
              />
              <TextField
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <TextField
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
              <TextField
                label="Requirements"
                value={formData.scholarRequirement}
                onChange={(e) => setFormData({ ...formData, scholarRequirement: e.target.value })}
              />
              <TextField
                label="Contact"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              />
              <TextField
                label="Start Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
              <TextField
                label="End Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} variant="contained">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </div>
    </div>
  );
}
