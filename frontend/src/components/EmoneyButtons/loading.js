import { Button, CircularProgress } from '@material-ui/core';
import { useState, useEffect } from 'react';
import CheckIcon from '@material-ui/icons/Check';

const LoadingButton = ({
  isLoading,
  loadingPromise,
  children,
  onLoadingCompleted,
  ...props
}) => {
  const [isLoadingByPromise, setIsLoadingByPromise] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  useEffect(() => {
    setLoadingComplete(false);
    if (!loadingPromise) {
      return;
    }

    async function waitForPromise() {
      setIsLoadingByPromise(true);
      await loadingPromise;
      setIsLoadingByPromise(false);
      setLoadingComplete(true);
    }
    waitForPromise();
  }, [loadingPromise]);

  const loading = isLoadingByPromise || isLoading;
  const disabled = props.disabled || loading;
  let endIcon = props.endIcon;
  if (loading) {
    endIcon = (
      <CircularProgress style={{ width: 15, height: 15 }} color="inherit" />
    );
  }

  if (loadingComplete) {
    const durationInMs = 1000;
    endIcon = (
      <CheckIcon
        className="animate__bounceIn"
        style={{ width: 15, height: 15 }}
        color="inherit"
      />
    );
    setTimeout(() => {
      setLoadingComplete(false);
      onLoadingCompleted && onLoadingCompleted();
    }, durationInMs + 100);
  }

  const isSmall = props.size === 'small';

  return (
    <Button
      {...props}
      variant="contained"
      color="primary"
      disabled={disabled}
      endIcon={!isSmall && endIcon}>
      {(isSmall && endIcon) || children}
    </Button>
  );
};

export default LoadingButton;
