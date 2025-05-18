'use client';

import { SemiCircleProgressBarProps } from '@/interface/SemiCircleProgressBarProps';
import React, { useEffect, useState } from 'react';



const SemiCircleProgressBar: React.FC<SemiCircleProgressBarProps> = ({
	value,
	size = 200,
	strokeWidth = 10,
	secondaryColor = '#E5E7EB', // Gris claro por defecto
}) => {
	const [progress, setProgress] = useState(0);
	const minValue = 350;
	const maxValue = 999;
	const radius = (size - strokeWidth) / 2;
	const centerX = size / 2;
	const centerY = size / 2;
	const circumference = Math.PI * radius; // Circunferencia de medio círculo

	// Normalizar el valor al rango 0-100% para el progreso visual
	const normalizedProgress = ((value - minValue) / (maxValue - minValue)) * 100;
	const strokeDashoffset = circumference - (progress / 100) * circumference;

	// Determinar el color según el rango
	const getProgressColor = (val: number) => {
		if (val <= 600) return '#EF4444'; // Rojo
		if (val <= 750) return '#FACC15'; // Amarillo
		return '#22C55E'; // Verde
	};

	// Animación suave para el progreso
	useEffect(() => {
		const timeout = setTimeout(() => {
			setProgress(Math.min(normalizedProgress, 100)); // Limita a 100%
		}, 100);
		return () => clearTimeout(timeout);
	}, [normalizedProgress]);

	return (
		<section className="flex flex-col items-center pt-3 bg-white">
			<svg
				width={size}
				height={size / 2 + strokeWidth / 2} // Ajustar altura para incluir grosor
				viewBox={`0 0 ${size} ${size / 2 + strokeWidth / 2}`}
			>
				{/* Fondo del semicírculo (parte superior, gris) */}
				<path
					d={`M ${strokeWidth / 2} ${centerY} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${centerY}`}
					fill="none"
					stroke={secondaryColor}
					strokeWidth={strokeWidth}
					strokeLinecap="round"
				/>
				{/* Barra de progreso (parte superior, color según rango) */}
				<path
					d={`M ${strokeWidth / 2} ${centerY} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${centerY}`}
					fill="none"
					stroke={getProgressColor(value)} // Color dinámico
					strokeWidth={strokeWidth}
					strokeLinecap="round"
					strokeDasharray={`${circumference} ${circumference}`}
					strokeDashoffset={strokeDashoffset}
					className="transition-all duration-1000 ease-in-out"
				/>
			</svg>

			{/* Valor actual debajo */}
			<div className="mt-2 text-3xl font-bold text-gray-800 relative top-[-30px]">
				{Math.round(value)}
			</div>
		</section>
	);
};

export default SemiCircleProgressBar;