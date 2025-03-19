'use client';

import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

type UserType = {
  id: number;
  nome: string;
  idade: number;
  email: string;
  onUpdate: () => void;
};

export function Card({ id, nome, idade, email, onUpdate }: UserType) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNome, setEditedNome] = useState(nome);
  const [editedIdade, setEditedIdade] = useState(idade);
  const [editedEmail, setEditedEmail] = useState(email);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: `Você está prestes a deletar o usuário ${nome}. Essa ação não pode ser desfeita!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#358a2d',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`https://list-user-api.onrender.com/users/${id}`);
        Swal.fire('Deletado!', 'O usuário foi deletado com sucesso.', 'success');
        onUpdate();
      } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        Swal.fire('Erro!', 'Não foi possível deletar o usuário.', 'error');
      }
    }
  };

  const handleSave = async () => {
    try {
      const updatedUser = {
        nome: editedNome,
        idade: editedIdade,
        email: editedEmail,
      };
      await axios.put(`https://list-user-api.onrender.com/users/${id}`, updatedUser);
      setIsEditing(false);
      Swal.fire('Sucesso!', 'Usuário atualizado com sucesso.', 'success');
      onUpdate();
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 409) {
            Swal.fire('Erro!', 'Esse email já está em uso.', 'error');
          } else {
            console.error('Erro ao atualizar usuário:', error);
            Swal.fire('Erro!', 'Não foi possível atualizar o usuário.', 'error');
          }
    }
  };

  const handleCancel = () => {
    setEditedNome(nome);
    setEditedIdade(idade);
    setEditedEmail(email);
    setIsEditing(false);
  };

  return (
    <div className="min-h-[100px] w-[350px] bg-white p-4 rounded-lg shadow-md flex flex-col justify-between items-start mb-4 gap-4">
      {isEditing ? (
        <div className="flex-1">
          <div className="mb-2">
            <input
              type="text"
              value={editedNome}
              onChange={(e) => setEditedNome(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-2">
            <input
              type="number"
              value={editedIdade}
              onChange={(e) => setEditedIdade(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-2">
            <input
              type="email"
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      ) : (
        <div className="flex-1">
          <p className="text-lg font-semibold">{nome}</p>
          <p className="text-sm text-gray-600">Idade: {idade}</p>
          <p className="text-sm text-gray-600">Email: {email}</p>
        </div>
      )}

      <div className="flex space-x-2">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Salvar
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Editar
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Deletar
            </button>
          </>
        )}
      </div>
    </div>
  );
}