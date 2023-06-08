import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import ProgressCircle from "../progressCircle/ProgressCircle";

const StatBox = ({
  title,
  subtitle,
  icon,
  progress,
  increase,
  images = [],
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" m="0 30px">
      <Box display="flex" justifyContent="space-between">
        <Box>
          {icon}
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            {title}
          </Typography>
        </Box>
        {progress ? (
          <Box>
            <ProgressCircle progress={progress} />
          </Box>
        ) : null}
        {images.length ? (
          <Box position={"relative"}>
            {images.map((image, index) => {
              if (!image) return null;
              return (
                <img
                  key={index}
                  src={image}
                  alt="stat"
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    objectPosition: "top",
                    borderRadius: "50%",
                    position: "absolute",
                    maxWidth: "unset",
                    border: `3px solid ${colors.greenAccent[500]}`,
                    right: `${index * 30}px`,
                  }}
                />
              );
            })}
          </Box>
        ) : null}
      </Box>
      <Box display="flex" justifyContent="space-between" mt="2px">
        <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
          {subtitle}
        </Typography>
        <Typography
          variant="h5"
          fontStyle="italic"
          sx={{ color: colors.greenAccent[600] }}
        >
          {increase}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatBox;
