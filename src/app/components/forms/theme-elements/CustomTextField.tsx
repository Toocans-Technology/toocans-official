// import { TextField } from "@mui/material";
// import { styled } from "@mui/material/styles";

// const CustomTextField = styled((props: any) => (
//   <TextField InputProps={{ disableUnderline: true }} {...props} />
// ))(({ theme }) => ({
//   "& .MuiOutlinedInput-input::-webkit-input-placeholder": {
//     color: theme.palette.text.secondary,
//     opacity: "0.8",
//   },
//   "& .MuiOutlinedInput-input.Mui-disabled::-webkit-input-placeholder": {
//     color: theme.palette.text.secondary,
//     opacity: "1",
//   },
//   "& .Mui-disabled .MuiOutlinedInput-notchedOutline": {
//     borderColor: theme.palette.grey[200],
//   },
//   "& .MuiOutlinedInput-notchedOutline": {
//     border: "none",
//   },
//   "& .MuiOutlinedInput-root": {
//     background: "#f5f5f5 !important",
//     borderRadius: "8px",
//     color: "#000",
//     transition: "border-color 0.2s ease-in-out",
//     "&:hover": {
//       "& .MuiOutlinedInput-notchedOutline": {
//         border: "1px solid transparent",
//       },
//     },
//     "&.Mui-focused": {
//       "& .MuiOutlinedInput-notchedOutline": {
//         border: "1px solid #222",
//       },
//     },
//   },
// }));

// export default CustomTextField;

import { TextField, TextFieldProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const CustomTextField = styled(
  ({
    disableUnderline,
    ...props
  }: TextFieldProps & { disableUnderline?: boolean }) => {
    // Only pass disableUnderline to InputProps if it's defined
    const inputProps = disableUnderline ? { disableUnderline: true } : {};

    return <TextField variant="outlined" InputProps={inputProps} {...props} />;
  }
)(({ theme }) => ({
  "& .MuiOutlinedInput-input::-webkit-input-placeholder": {
    color: theme.palette.text.secondary,
    opacity: "0.8",
  },
  "& .MuiOutlinedInput-input.Mui-disabled::-webkit-input-placeholder": {
    color: theme.palette.text.secondary,
    opacity: "1",
  },
  "& .Mui-disabled .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.grey[200],
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "& .MuiOutlinedInput-root": {
    background: "#f5f5f5 !important",
    borderRadius: "8px",
    color: "#000",
    transition: "border-color 0.2s ease-in-out",
    "&:hover": {
      "& .MuiOutlinedInput-notchedOutline": {
        border: "1px solid transparent",
      },
    },
    "&.Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline": {
        border: "1px solid #222",
      },
    },
  },
}));

export default CustomTextField;
