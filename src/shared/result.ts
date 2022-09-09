export class Result<T> {
	public isSuccess: boolean
	public isFailure: boolean
	public error?: T | string
	private _value?: T

	public constructor(isSuccess: false, error?: T | string)
	public constructor(isSuccess: true, data?: T)
	public constructor(isSuccess: boolean, value?: T | string) {
		this.isSuccess = isSuccess
		this.isFailure = !isSuccess

		if (isSuccess) this._value = value as T
		else this.error = value

		Object.freeze(this)
	}

	public getValue(): T {
		if (!this.isSuccess) {
			return this.error as T
		}

		return this._value!
	}

	public static ok<U>(value?: U): Result<U> {
		return new Result<U>(true, value)
	}

	public static fail<U>(error: any): Result<U> {
		return new Result<U>(false, error)
	}
}
