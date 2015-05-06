<?php
$bower_content = file_get_contents('../bower.json');

$version = (preg_match('/"version": "([0-9\.]+)"/', $bower_content, $bower_version_matches) ? $bower_version_matches[1] : null);
?>
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">

        <meta http-equiv="x-ua-compatible" content="ie=edge">

		<title>pxlCore</title>

		<meta name="viewport" content="width=device-width, initial-scale=1">

		<link href="libs/bower/semantic/dist/semantic.min.css" rel="stylesheet">
		<link href="css/main.css" rel="stylesheet">
	</head>

	<body>
		<div id="container" class="ui page grid">
			<div class="sixteen wide column">
				<div class="ui segment">
					<div class="ui header">
						<i class="cube icon"></i>

						<div class="content">
							pxlCore
							<div class="sub header">Version <?= $version ?></div>
						</div>
					</div>

					<div class="ui purple segment">
						<h2 class="ui header">pxlCore</h2>

						<div class="ui top attached tabular menu">
							<a class="active item" data-tab="api">API</a>
							<a class="item" data-tab="methods">Methods</a>
							<a class="item" data-tab="examples">Examples</a>
						</div>

						<div class="ui bottom attached active tab segment" data-tab="api">
							<table class="ui celled sortable definition table segment">
								<thead>
									<tr>
										<th>Setting</th>
										<th class="four wide">Default</th>
										<th>Description</th>
									</tr>
								</thead>

								<tbody>
									<tr>
										<td>debug</td>
										<td>false</td>
										<td>Whether to display debugging information or not</td>
									</tr>
									<tr>
										<td>notification</td>
										<td>
											engines: []
										</td>
										<td>
											Which notification engines to load
										</td>
									</tr>
								</tbody>
							</table>
						</div>

						<div class="ui bottom attached tab segment" data-tab="methods">
							<h3 class="ui header">log</h3>
						</div>

						<div class="ui bottom attached tab segment" data-tab="examples">
							<h4 class="ui header">Minimal</h4>

							<div class="ui existing secondary segment">
								$pxl.log('Example.');
							</div>

							<h4 class="ui header">Full</h4>

							<div class="ui existing secondary segment">
								$pxl.log('Example.', 'black', 'white');
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<script src="libs/bower/jquery/dist/jquery.min.js"></script>
		<script src="libs/bower/semantic/dist/semantic.min.js"></script>

		<script src="js/main.js"></script>
	</body>
</html>