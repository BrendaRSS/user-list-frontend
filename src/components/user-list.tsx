'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Card } from './card';

interface User {
  id: number;
  nome: string;
  idade: number;
  email: string;
}

const schema = yup.object({
  nome: yup.string().required('Nome é obrigatório').min(2, 'Nome deve ter pelo menos 2 caracteres'),
  idade: yup
    .number()
    .required('Idade é obrigatória')
    .min(1, 'Idade deve ser maior que 0')
    .typeError('Idade deve ser um número'),
  email: yup.string().required('Email é obrigatório').email('Email inválido'),
}).required();

type FormData = yup.InferType<typeof schema>;

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://list-user-api.onrender.com/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post('https://list-user-api.onrender.com/users', data);
      fetchUsers();
      setShowForm(false);
      reset();
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error);
    }
  };

  return (
    <div className="h-full w-full p-8 flex flex-col items-center justify-center gap-7 bg-neutral-200">
      <div className="h-[100px] w-fit flex items-center justify-center font-bold text-[52px]">
        <span>Lista de Usuários</span>
      </div>

      <div className="flex flex-col items-center justify-center">
      {users.length === 0 ? (
          <p className="text-center text-gray-500">Nenhum usuário encontrado.</p>
        ) : (
            users.map((user) => (
                <Card
                    key={user.id}
                    id={user.id}
                    nome={user.nome}
                    idade={user.idade}
                    email={user.email}
                    onUpdate={fetchUsers}
                />
            ))
        )}
      </div>
      
    <div className='h-fit w-fit flex flex-col items-center justify-items-start gap-1'>
    <div className="text-center mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="h-fit w-[350px] bg-blue-500 text-white px-4 py-2.5 rounded hover:bg-blue-600 cursor-pointer"
        >
          {showForm ? 'Fechar Formulário' : 'Adicionar Usuário'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="h-fit w-[350px] mx-auto bg-white p-6 rounded-lg shadow-md mb-6"
        >
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              id="name"
              {...register('nome')}
              className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">
              Idade
            </label>
            <input
              id="age"
              type="number"
              {...register('idade')}
              className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.idade && <p className="text-red-500 text-sm mt-1">{errors.idade.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Adicionar
          </button>
        </form>
      )}
    </div>

    </div>
  );
}