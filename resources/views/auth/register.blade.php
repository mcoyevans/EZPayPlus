@extends('main')

@section('content')
	<md-card>
		<md-card-content>
			<form method="POST" action="/register" class="form-medium">
				<div layout="row" flex>
					{!! csrf_field() !!}
					<!-- Company -->
					<md-input-container class="md-block" flex-xs="100" flex-sm="100" flex-gt-sm>
						<label>Company</label>
						<input type="text" name="company" value="{{ old('company') }}" required>
					</md-input-container>
				</div>
				<div layout="row">
					<!-- Name -->
					<md-input-container class="md-block" flex-xs="100" flex-sm="100" flex-gt-sm>
						<label>Name</label>
						<input type="text" name="name" value="{{ old('name') }}" required>
					</md-input-container>
					<!-- User Name -->
					<md-input-container class="md-block" flex-xs="100" flex-sm="100" flex-gt-sm>
						<label>User Name</label>
						<input type="text" name="username" value="{{ old('username') }}" required>
					</md-input-container>
				</div>
				<div layout="row">
					<!-- Password -->
					<md-input-container class="md-block" flex-xs="100" flex-sm="100" flex-gt-sm>
						<label>Password</label>
						<input type="password" name="password" required>
						 @if ($errors->has('password'))
							<div class="pattern">{{ $errors->first('password') }}</div>
                        @endif
					</md-input-container>
					<!-- Confirm Password -->
					<md-input-container class="md-block" flex-xs="100" flex-sm="100" flex-gt-sm>
						<label>Confirm Password</label>
						<input type="password" name="password_confirmation" required>
						 @if ($errors->has('password_confirmation'))
							<div class="pattern">{{ $errors->first('password_confirmation') }}</div>
                        @endif
					</md-input-container>
				</div>
					<div class="md-actions" layout="row" layout-align="end center">
						<!-- Register -->
						<md-button type="submit" class="md-primary md-raised">Register</md-button>
					</div>
				</div>
			</form>
		</md-card-content>
	</md-card>
@stop