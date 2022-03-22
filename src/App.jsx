import React, { useEffect, useState } from 'react'

import classes from './App.module.scss'
import './index.scss';

export const App = () => {
	const [size, setSize] = useState(5)
	const [vector, setVector] = useState([])
	const [W, setW] = useState([])
	const [V, setV] = useState([])
	const [Net1, setNet1] = useState([])
	const [Net2, setNet2] = useState([])
	const [Out1, setOut1] = useState([])
	const [Out2, setOut2] = useState([])

	const createMatrix = (value) => {
		const row = Array.from({ length: size }).fill(value)

		return Array.from({ length: size }).fill(row)
	}

	const autoSetup = () => {
		if (vector.length && vector.length !== size) {
			const value = 0

			setVector(Array.from({ length: size }).fill([value]))
		}

		if (W.length && W.length !== size) {
			const value = 0

			setW(createMatrix(value))
		}

		if (V.length && V.length !== size) {
			const value = 0

			setV(createMatrix(value))
		}
	}

	const computeNet = (vector, matrix) => {
		console.log(vector)
		if (vector.length !== size || matrix.length !== size) return []

		const result = Array.from({ length: vector.length }).fill(0)

		for (let i = 0; i < matrix.length; i++) {
			for (let j = 0; j < vector.length; j++) {
				result[i] += parseFloat(matrix[i][j]) * parseFloat(vector[j]);
			}
			console.log(result[i]);
		}

		return result
	}

	const computeOut = (net) => {
		return net.map(num => 1 / (1 + Math.pow(Math.E, -num)))
	}

	useEffect(() => {
		setNet1(computeNet(vector.map(([num]) => num), W))
	}, [vector, W])

	useEffect(() => {
		setOut1(computeOut(Net1))
	}, [Net1])

	useEffect(() => {
		setNet2(computeNet(Out1, V))
	}, [Out1, V])

	useEffect(() => {
		setOut2(computeOut(Net2))
	}, [Net2])

	const ResultColumn = ({ title, result }) => {
		return (
			<div className={classes.resultColumn}>
				<p className={classes.title}>{title}</p>
				<div className={classes.net}>
					{result.map((num, index) => {
						if (typeof (num) === 'number') {
							return <div key={`num-${index}`}>{parseFloat(num.toFixed(4))}</div>
						}

						return <div key={`num-${index}`}>{num}</div>
					})}
				</div>
			</div>
		)
	}

	return (
		<div className={classes.wrapper}>
			<div className={classes.content}>
				<div className={classes.main}>
					<div className={classes.matrix}>
						<p>Вектор</p>
						<MatrixInput
							rows={size}
							columns={1}
							className={`${classes.matrixInput} ${classes.vector}`}
							value={vector}
							setValue={setVector}
						/>
					</div>
					<div className={classes.matrix}>
						<p>Весовые коэффициенты первого слоя</p>
						<MatrixInput
							className={classes.matrixInput}
							value={W}
							setValue={setW}
						/>
					</div>

					<div className={classes.matrix}>
						<p>Весовые коэффициенты второго слоя</p>
						<MatrixInput
							className={classes.matrixInput}
							value={V}
							setValue={setV}
						/>
					</div>
				</div>
				<div className={classes.offsetWrapper}>
					<span>Размер</span>
					<input
						type='number'
						className={classes.sizeInput}
						min={1}
						value={size}
						onChange={({ target }) => { setSize(parseInt(target.value)) }}
					/>
					<button className={classes.resolve} onClick={autoSetup}>Сдать лабу</button>
				</div>
				<div className={classes.resultColumns}>
					<ResultColumn title='NET1' result={Net1} />
					<ResultColumn title='' result={"→ ".repeat(Net1.length).split(" ").slice(0, Net1.length)} />
					<ResultColumn title='OUT1' result={Out1} />
					<ResultColumn title='' result={"→ ".repeat(Out1.length).split(" ").slice(0, Out1.length)} />
					<ResultColumn title='NET2' result={Net2} />
					<ResultColumn title='' result={"→ ".repeat(Net2.length).split(" ").slice(0, Out1.length)} />
					<ResultColumn title='OUT2' result={Out2} />
				</div>
			</div>
		</div>
	)
}

const MatrixInput = ({
	rows,
	columns,
	value: initialValue,
	setValue: setInitialValue,
	className
}) => {
	const [value, setValue] = useState('')
	const [isValid, setIsValid] = useState(true)
	const [touched, setTouched] = useState(false)
	const parseValue = (value) => {
		return value.map(row => row.join(' ')).join('\n')
	}
	const processValue = (value) => {
		return value.split('\n').map(
			row => row.split(' ').map(
				num => {
					const result = parseFloat(num)
					return !isNaN(result) ? result : num
				}
			)
		)
	}

	const validate = (value) => {
		const currentRows = value.split('\n')
		if (rows && currentRows.length !== rows) {
			return false
		}

		if (columns && !currentRows.every(row => row.split(' ').length === columns)) {
			return false
		}

		if (!currentRows.every(row => row.split(' ').every(num => num.match(/^\d+([,.]\d+)?$/)))) {
			return false
		}

		return true
	}

	useEffect(() => {
		if (!Array.isArray(initialValue)) {
			setValue('')
		} else {
			const value = parseValue(initialValue)
			setValue(value)
			const isValid = validate(value)
			setIsValid(isValid)
		}
	}, [initialValue])

	const onBlur = () => {
		!touched && setTouched(true)
		const isValid = validate(value)
		setIsValid(isValid)
		if (value && setInitialValue) {
			setInitialValue(processValue(value))
		}
	}

	const changeHandler = ({ target }) => {
		setValue(target.value)
	}

	return (
		<textarea
			className={`${touched && !isValid ? classes.hasError : ''} ${className}`}
			value={value}
			onChange={changeHandler}
			onBlur={onBlur}
		/>
	)
}