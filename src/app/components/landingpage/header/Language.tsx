import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import React, { useState } from "react";

const StyledMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    marginTop: theme.spacing(1),
    borderRadius: 8,
    minWidth: 120,
    backgroundColor: "#FFF",
    color: "#222222",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    "& .MuiMenu-list": {
      padding: "8px 0",
    },
    "& .MuiMenuItem-root": {
      padding: "8px 16px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "#0D0D0D",
      "&:hover": {
        backgroundColor: "transparent",
      },
      "&.Mui-selected": {
        backgroundColor: "transparent",
        "&:hover": {
          backgroundColor: "transparent",
        },
      },
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.primary.main,
      },
    },
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  padding: 0,
  "&:hover": {
    backgroundColor: "transparent",
  },
}));

interface Language {
  code: string;
  name: string;
}

const languages: Language[] = [
  { code: "en", name: "English" },
  { code: "zh", name: "简体中文" },
];

const Language: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageSelect = (code: string) => {
    setSelectedLanguage(code);
    handleClose();
  };

  return (
    <Box>
      <StyledIconButton onClick={handleClick}>
        <Image
          src="/images/svgs/language.svg"
          alt="Language"
          width={20}
          height={20}
        />
      </StyledIconButton>
      <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageSelect(lang.code)}
            selected={selectedLanguage === lang.code}
          >
            {lang.name}
            {selectedLanguage === lang.code && (
              <Image
                src="/images/svgs/CheckCircleIcon.svg"
                alt="Selected"
                width={20}
                height={20}
              />
            )}
          </MenuItem>
        ))}
      </StyledMenu>
    </Box>
  );
};

export default Language;
