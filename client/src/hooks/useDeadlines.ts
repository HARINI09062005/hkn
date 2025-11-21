import { useAppContext } from '../context/AppContext';
import { Deadline } from '../types';

export const useDeadlines = () => {
    const { state, dispatch } = useAppContext();

    const addDeadline = (deadline: Deadline) => {
        dispatch({ type: 'ADD_DEADLINE', payload: deadline });
    };

    const updateDeadline = (deadline: Deadline) => {
        dispatch({ type: 'UPDATE_DEADLINE', payload: deadline });
    };

    const deleteDeadline = (id: string) => {
        dispatch({ type: 'DELETE_DEADLINE', payload: id });
    };

    return {
        deadlines: state.deadlines,
        isLoading: state.isLoading,
        addDeadline,
        updateDeadline,
        deleteDeadline,
    };
};
