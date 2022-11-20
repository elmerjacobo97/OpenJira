import {ChangeEvent, FC, useContext, useMemo, useState} from "react";
import {GetServerSideProps} from 'next';
import {
    Button, capitalize,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    FormControl, FormControlLabel,
    FormLabel,
    Grid, IconButton, Radio,
    RadioGroup,
    TextField,
} from '@mui/material';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import {EntriesContext} from "../../context/entries";
import {dbEntries} from '../../database'
import { Layout } from '../../components/layouts';
import {Entry, EntryStatus} from '../../interfaces';
import {dateFunctions} from '../../utils'
import {useRouter} from "next/router";

const validStatus: EntryStatus[] = ['pending', 'in-progress', 'finished'];

interface Props {
    entry: Entry;
}

const EntryPage: FC<Props> = ({entry}) => {
    const router = useRouter();
    const [inputValue, setInputValue] = useState(entry.description);
    const [status, setStatus] = useState<EntryStatus>(entry.status);
    const [touched, setTouched] = useState(false);

    const {updatedEntry, deleteEntry} = useContext(EntriesContext);

    const isNotValid = useMemo(() => inputValue.length <= 0 && touched, [inputValue, touched]);

    const onInputValueChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const onStatusChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setStatus(event.target.value as EntryStatus);
    }

    const onSave = () => {
        if (inputValue.trim().length === 0) return;
        const updateEntry: Entry = {
            ...entry,
            status,
            description: inputValue,
        }
        updatedEntry(updateEntry, true);
        router.push('/')
    }

    const onDelete = () => {
        deleteEntry( entry, true );
        router.push('/')
    }

    return (
        <Layout title={`${inputValue.substring(0, 20)} ...`}>
            <Grid container justifyContent="center" sx={{ marginTop: 2 }}>
                <Grid item xs={12} sm={8} md={6}>
                    <Card>
                        <CardHeader
                            title={`Entrada:`}
                            subheader={`Creada ${dateFunctions.getFormatDistanceToNow(entry.createdAt)}`}
                        />
                        <CardContent>
                            <TextField
                                sx={{
                                    marginTop: 2,
                                    marginBottom: 2
                                }}
                                fullWidth
                                placeholder="Nueva Entrada"
                                autoFocus
                                multiline
                                label="Nueva Entrada"
                                value={inputValue}
                                onBlur={() => setTouched(true)}
                                onChange={onInputValueChanged}
                                helperText={isNotValid && 'Ingrese un valor'}
                                error={isNotValid}
                            />
                            <FormControl>
                                <FormLabel>Status:</FormLabel>
                                <RadioGroup
                                    row={true}
                                    value={status}
                                    onChange={onStatusChanged}
                                >
                                    {
                                        validStatus.map(option => (
                                            <FormControlLabel
                                                key={option}
                                                value={option}
                                                control={<Radio />}
                                                label={capitalize(option)}
                                            />
                                        ))
                                    }
                                </RadioGroup>
                            </FormControl>
                        </CardContent>
                        <CardActions>
                            <Button
                                startIcon={<SaveOutlinedIcon />}
                                variant="contained"
                                fullWidth
                                onClick={onSave}
                                disabled={inputValue.length <= 0}
                            >
                                Save
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
            <IconButton
                sx={{
                    position: "fixed",
                    bottom: 30,
                    right: 30,
                    backgroundColor: 'error.dark',
                }}
                onClick={onDelete}
            >
                <DeleteOutlinedIcon />
            </IconButton>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async ({params}) => {
    // Extraer el id de la URL
    const {id} = params as {id: string};

    const entry = await dbEntries.getEntryById(id);

    // Si la entry regresa null, sacamos al user
    if (!entry) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    return {
        props: {
            entry: {
                ...entry,
                _id: entry._id.toString(), // convertir el _id a string
            }
        }
    }
}



export default EntryPage;
