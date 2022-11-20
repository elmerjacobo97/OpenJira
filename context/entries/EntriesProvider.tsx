import { FC, PropsWithChildren, useEffect, useReducer } from 'react';
import { useSnackbar } from 'notistack';
import { Entry } from '../../interfaces';
import { EntriesContext, entriesReducer } from './';
import { entriesApi } from '../../apis';

export interface EntriesState {
    entries: Entry[];
}

const Entries_INITIAL_STATE: EntriesState = {
    entries: [],
};

export const EntriesProvider: FC<PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = useReducer(entriesReducer, Entries_INITIAL_STATE);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const addNewEntry = async (description: string) => {
        const { data } = await entriesApi.post<Entry>('/entries', {
            description,
        });

        dispatch({ type: '[Entries] - Add Entry', payload: data });
    };

    const updatedEntry = async ({ _id, description, status }: Entry, showSnackbar = false) => {
        try {
            const { data } = await entriesApi.put<Entry>(`/entries/${_id}`, {
                description,
                status,
            });
            dispatch({ type: '[Entries] - Entry Updated', payload: data });
            if (showSnackbar)
                enqueueSnackbar('Entrada Actualizada', {
                    variant: 'success',
                    autoHideDuration: 1500,
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right'
                    }
                })
        } catch (error) {
            console.log({ error });
        }
    };

    const deleteEntry = async (entry: Entry, showSnackbar = false ) => {
        try {
            const { data } = await entriesApi.delete<Entry>(`/entries/${entry._id}` )

            dispatch({type: '[Entries] - Delete Entry', payload: data })

            if( showSnackbar ) {
                enqueueSnackbar('Entrada eliminada correctamente',{
                    variant: 'success',
                    autoHideDuration: 1500,
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    }
                })
            }
        } catch (error) {
            console.log({ error });
        }
    }

    const refreshEntries = async () => {
        const { data } = await entriesApi.get<Entry[]>('/entries');
        dispatch({ type: '[Entries] - Refresh Data', payload: data });

    };

    useEffect(() => {
        refreshEntries();
    }, []);

    return (
        <EntriesContext.Provider
            value={{
                ...state,

                // Methods
                addNewEntry,
                updatedEntry,
                deleteEntry
            }}
        >
            {children}
        </EntriesContext.Provider>
    );
};
