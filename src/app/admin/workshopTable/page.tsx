'use client';

import { useEffect, useMemo, useState } from 'react';
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
import { Delete, Edit } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import { workshopAPI, authAPI } from '@/services/api';
import AdminSidebar from '@/components/admin/SideBar';
import { useRouter } from 'next/navigation';

interface Workshop {
  id: number;
  nameWorkshop: string;
  description: string;
  date: string;
  linkWorkshop: string;
}

export default function WorkshopTablePage() {
  const router = useRouter();
  const [data, setData] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<MRT_Row<Workshop> | null>(null);
  const [formData, setFormData] = useState<Omit<Workshop, 'id'>>({
    nameWorkshop: '',
    description: '',
    date: '',
    linkWorkshop: '',
  });

  const fetchWorkshops = async () => {
    setLoading(true);
    try {
      const result = await workshopAPI.getAll();
      setData(result);
    } catch {
      toast.error('Gagal memuat workshop');
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
      } catch {
        try {
          const refresh = await authAPI.refreshToken();
          if (refresh.user?.role !== 'ADMIN') {
            throw new Error('Bukan admin setelah refresh');
          }
        } catch {
          toast.error('Sesi habis, silakan login ulang');
          setTimeout(() => router.push('/auth/login'), 1500);
          return;
        }
      }

      // Jika validasi admin berhasil, ambil data
      fetchWorkshops();
    };

    validateAdmin();
  }, [router]);

  const columns = useMemo<MRT_ColumnDef<Workshop>[]>(() => [
    { accessorKey: 'nameWorkshop', header: 'Workshop Name' },
    { accessorKey: 'description', header: 'Description' },
    { accessorKey: 'date', header: 'Date' },
    { accessorKey: 'linkWorkshop', header: 'Link' },
  ], []);

  const handleOpenDialog = (row?: MRT_Row<Workshop>) => {
    if (row) {
      setEditingRow(row);
      setFormData({
        nameWorkshop: row.original.nameWorkshop,
        description: row.original.description,
        date: row.original.date,
        linkWorkshop: row.original.linkWorkshop,
      });
    } else {
      setEditingRow(null);
      setFormData({
        nameWorkshop: '',
        description: '',
        date: '',
        linkWorkshop: '',
      });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
  if (!formData.nameWorkshop || !formData.description || !formData.date || !formData.linkWorkshop) {
    toast.error('Semua field harus diisi.');
    return;
  }

  try {
    if (editingRow) {
      // mode edit
      await workshopAPI.update(editingRow.original.id, formData);
      toast.success('Workshop updated');
    } else {
      // mode tambah
      await workshopAPI.create({
        nameWorkshop: formData.nameWorkshop,
        description: formData.description,
        date: formData.date,
        linkWorkshop: formData.linkWorkshop,
      });
      toast.success('Workshop added');
    }

    setDialogOpen(false);
    fetchWorkshops();
  } catch (error: any) {
    console.error('Save error:', error);
    toast.error(error?.response?.data?.message || 'Fail to save workshop');
  }
};

  const handleDelete = async (id: number) => {
    const confirm = window.confirm('Are you sure delete this workshop?');
    if (!confirm) return;
    try {
      await workshopAPI.delete(id);
      toast.success('Workshop deleted');
      fetchWorkshops();
    } catch {
      toast.error('Fail to delete workshop');
    }
  };

  return (
    <div className="flex min-h-screen">
      <ToastContainer />
      <AdminSidebar />
      <div className="flex-1 p-6 bg-gray-50">
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>
            Manajemen Workshop
          </Typography>

          <MaterialReactTable
            columns={columns}
            data={data}
            state={{ isLoading: loading }}
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
              </Box>
            )}
            renderTopToolbarCustomActions={() => (
              <Button variant="contained" onClick={() => handleOpenDialog()}>
                Add Workshop
              </Button>
            )}
          />

          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>{editingRow ? 'Edit Workshop' : 'Add Workshop'}</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Workshop Name"
                value={formData.nameWorkshop}
                onChange={(e) => setFormData({ ...formData, nameWorkshop: e.target.value })}
              />
              <TextField
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <TextField
                label="Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
              <TextField
                label="Link Workshop"
                value={formData.linkWorkshop}
                onChange={(e) => setFormData({ ...formData, linkWorkshop: e.target.value })}
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
