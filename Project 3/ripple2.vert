#version 330 compatibility
uniform float uLightX, uLightY, uLightZ;
uniform float uA, uB, uC, uD;

out vec2 vST; // texture coords
out vec3 vN; // normal vector
out vec3 vL; // vector from point to light
out vec3 vE; // vector from point to eye
out vec3 vMCposition;

const vec3 LIGHTPOSITION = vec3( 5., 5., 0. );

void
main( )
{

	// Z = A * cos(2piBr+C) * e-Dr
	// r2 = x2 + y2   (squared)

	vMCposition = gl_Vertex.xyz;
	float x = vMCposition.x;
	float y = vMCposition.y;

	
	float r2 = pow(x, 2) + pow(y, 2);
	float r = sqrt(r2);
	const float M_PI = 3.1415926535897932384626433832795;

	float Z = uA * cos(((2 * M_PI * uB * r) + uC) * exp(-uD * r));

	float drdx = x/r;
	float drdy = y/r;

	// float dzdr = A * [ -sin(2.*pi*B*r+C) * 2.*?*B * exp(-D*r) + cos(2.*pi*B*r+C) * -D * exp(-Dr) ]

	float dzdr = uA * ( -sin(2.*M_PI*uB*r+uC) * 2.*M_PI*uB * exp(-uD*r) + cos(2.*M_PI*uB*r+uC) * -uD * exp(-uD*r));

	float dzdx = dzdr * drdx;
	float dzdy = dzdr * drdy;

	vec3 Tx = vec3(1., 0., dzdx );
	vec3 Ty = vec3(0., 1., dzdy );


	// pass this over to the frag shader
	vec3 normal = normalize( cross( Tx, Ty ) );
	vN = normal;


	vST = gl_MultiTexCoord0.st;
	vec4 ECposition = gl_ModelViewMatrix * gl_Vertex; // eye coordinate position
	// vN = normalize( gl_NormalMatrix * gl_Normal ); // normal vector
	vL = LIGHTPOSITION - ECposition.xyz; // vector from the point to the light position
	vE = vec3( 0., 0., 0. ) - ECposition.xyz; // vector from the point to the eye position
	vec3 vert = vec3(x, y, Z);
	gl_Position = gl_ModelViewProjectionMatrix * vec4(vert, 1.);
	vMCposition = vert;
}