export interface SemiCircleProgressBarProps {
	value: number; // Valor entre 350 y 999
	size?: number; // Tamaño del SVG (en píxeles, por defecto 200)
	strokeWidth?: number; // Grosor de la barra (por defecto 10)
	secondaryColor?: string; // Color del fondo
}