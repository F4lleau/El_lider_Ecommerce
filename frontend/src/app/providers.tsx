import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { ReactNode, useState } from "react";
import { muiTheme } from "../theme/mui-theme";

type Props = {
	children: ReactNode;
};

export function AppProviders({ children }: Props) {
	const [queryClient] = useState(() => new QueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={muiTheme}>
				<CssBaseline />
				{children}
			</ThemeProvider>
		</QueryClientProvider>
	);
}
