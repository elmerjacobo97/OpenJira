import {useRouter} from "next/router";
import {
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    Typography,
} from '@mui/material';
import { FC, DragEvent, useContext } from 'react';
import { Entry } from '../../interfaces';
import { UIContext } from '../../context/ui';
import {dateFunctions} from '../../utils'

interface Props {
    entry: Entry;
}

export const EntryCard: FC<Props> = ({ entry }) => {
    const router = useRouter();
    const { startDragging, endDragging } = useContext(UIContext);

    const onDragStart = (event: DragEvent) => {
        event.dataTransfer.setData('text', entry._id);
        startDragging();
    };

    const onDragEnd = () => {
        endDragging();
    };

    const onClick = () => {
        router.push(`/entries/${entry._id}`);
    }

    return (
        <Card
            sx={{
                margin: 1,
            }}
            draggable={true}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onClick={onClick}
        >
            <CardActionArea>
                <CardContent>
                    <Typography sx={{ whiteSpace: 'pre-line' }}>
                        {entry.description}
                    </Typography>
                </CardContent>

                <CardActions
                    sx={{
                        display: 'flex',
                        justifyContent: 'end',
                        marginRight: 1,
                    }}
                >
                    <Typography
                        variant="body2">
                        {dateFunctions.getFormatDistanceToNow(entry.createdAt)}
                    </Typography>
                </CardActions>
            </CardActionArea>
        </Card>
    );
};
