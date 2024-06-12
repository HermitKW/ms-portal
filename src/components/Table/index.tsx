import { TableCell, Typography } from "@mui/material";

export function TableHeader({ children = null }){
    return (
        <TableCell>
            {children?
                <Typography
                    variant="body1"                      
                    fontWeight="bold"
                    color="text.primary"
                    gutterBottom
                    >                
                    {children}
                </Typography>
            : null}
        </TableCell>
    );
}