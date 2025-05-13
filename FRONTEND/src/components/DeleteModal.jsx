import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { useItemContext } from '../components/ItemContext';
import { toast } from 'react-toastify';

const DeleteModal = ({ show, handleClose, user }) => {
  const { deleteUser, users, setUsers } = useItemContext(); // Ensure setUsers is available

  const handleDelete = async () => {
    try {
      // Send DELETE request to backend
      const response = await fetch(`http://localhost:5000/api/items/users/${user._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Update context state by removing the user locally
        const updatedUsers = users.filter((item) => item._id !== user._id);
        setUsers(updatedUsers); // Update state in context

        // Show success toast
        toast.success('User deleted successfully!');
      } else {
        // Show error toast if deletion failed
        toast.error('Error deleting user!');
      }

      // Close modal after handling success/error
      handleClose();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user!');
      handleClose();
    }
  };

  return (
    <Modal isOpen={show} toggle={handleClose}>
      <ModalHeader toggle={handleClose}>Confirm Delete</ModalHeader>
      <ModalBody>
        Are you sure you want to delete the student{' '}
        <strong>{user.firstName} {user.lastName}</strong> from{' '}
        <strong>{user.department}</strong> department as a{' '}
        <strong>{user.userRole}</strong>?
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button color="danger" onClick={handleDelete}>
          Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteModal;
